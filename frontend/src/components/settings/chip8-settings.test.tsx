import _ from 'lodash';
import { driver, resetDriver, elementHasClass } from '@/tests/selenium';
import { SettingsPage } from './__pageobjects__/settings-page';
import { CHIP8SettingsPanel } from './__pageobjects__/chip8-settings';
import { By } from 'selenium-webdriver';
import { defaultSettings } from '@/src/storage/user-data';

import React from 'react';
import renderer from 'react-test-renderer';
import CHIP8Settings from './chip8-settings';

beforeEach(async () => {
    await driver.navigate().to('http://localhost:8000/settings');
});

afterEach(async () => {
    resetDriver();
});

jest.mock('@/src/storage/user-data', () => {
    const originalModule = jest.requireActual('@/src/storage/user-data');
    const useUserProfile = jest.fn();
    useUserProfile.mockReturnValue([
        {
            profileImage: '/image.png',
            userName: 'Guest',
            settings: {
                chip8Controls: [
                    'KeyX',
                    'Digit1',
                    'Digit2',
                    'Digit3',
                    'KeyQ',
                    'KeyW',
                    'KeyE',
                    'KeyA',
                    'KeyS',
                    'KeyD',
                    'KeyZ',
                    'KeyC',
                    'Digit4',
                    'KeyR',
                    'KeyF',
                    'KeyV',
                ],
            },
        },
        jest.fn(),
    ]);
    return {
        __esModule: true,
        ...originalModule,
        useUserProfile,
    };
});

describe('CHIP8 Settings', () => {
    test('Click on side panel', async () => {
        await SettingsPage.clickCHIP8SidePanelButton();
        expect(await SettingsPage.getTitle()).toBe('CHIP 8 Controls');
    });

    test('Initial state', async () => {
        await SettingsPage.clickCHIP8SidePanelButton();

        const keyboardButtons = await CHIP8SettingsPanel.keyboardButtons();
        expect(keyboardButtons.length).toBe(16);
        const names = ['1', '2', '3', '4', 'Q', 'W', 'E', 'R', 'A', 'S', 'D', 'F', 'Z', 'X', 'C', 'V'];
        for (let i = 0; i < 16; i++) {
            const button = keyboardButtons[i];
            const innerButton = await button.findElement(By.css('button'));
            expect(await innerButton.getText()).toBe(names[i]);
        }

        const saveButton = await CHIP8SettingsPanel.saveButton();
        expect(await elementHasClass(saveButton, 'disabled')).toBe(true);
    });

    test('Changes should be saved', async () => {
        await SettingsPage.clickCHIP8SidePanelButton();

        let keyboardButtons = await CHIP8SettingsPanel.keyboardButtons();
        let innerButton = await keyboardButtons[0].findElement(By.css('button'));
        await innerButton.click();

        const body = driver.findElement(By.css('body'));
        await body.sendKeys('=');

        // fetch buttons again
        keyboardButtons = await CHIP8SettingsPanel.keyboardButtons();
        innerButton = await keyboardButtons[0].findElement(By.css('button'));
        expect(await innerButton.getText()).toBe('EQUAL');

        let saveButton = await CHIP8SettingsPanel.saveButton();
        expect(await elementHasClass(saveButton, 'disabled')).toBe(false);

        // Save settings
        await saveButton.click();

        // check indexeddb
        const result = await driver.executeScript(async () => {
            return await new Promise(resolve => {
                const openRequest = indexedDB.open('emulator-hub');
                openRequest.onsuccess = () => {
                    const db = openRequest.result;
                    const transaction = db.transaction('users');
                    const users = transaction.objectStore('users');

                    const request = users.getAll();
                    request.onsuccess = () => {
                        resolve(request.result[0].settings);
                    };
                };
            });
        });

        const expected = _.cloneDeep(defaultSettings);
        expected.chip8Controls[1] = 'Equal';

        expect(result).toEqual(expected);

        // Refresh the page
        await driver.navigate().refresh();
        await SettingsPage.clickCHIP8SidePanelButton();

        keyboardButtons = await CHIP8SettingsPanel.keyboardButtons();
        innerButton = await keyboardButtons[0].findElement(By.css('button'));
        expect(await innerButton.getText()).toBe('EQUAL');

        saveButton = await CHIP8SettingsPanel.saveButton();
        expect(await elementHasClass(saveButton, 'disabled')).toBe(true);
    });

    test('Snapshot', () => {
        const tree = renderer.create(<CHIP8Settings />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
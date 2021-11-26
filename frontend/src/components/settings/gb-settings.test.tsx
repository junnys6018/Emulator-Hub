import _ from 'lodash';
import { driver, resetDriver, elementHasClass } from '@/tests/selenium';
import { SettingsPage } from './__pageobjects__/settings-page';
import { GBSettingsPanel } from './__pageobjects__/gb-settings';
import { By } from 'selenium-webdriver';
import { defaultSettings } from '@/src/storage/user-data';

import React from 'react';
import renderer from 'react-test-renderer';
import GBSettings from './gb-settings';

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
                gbControls: {
                    up: ['ArrowUp', 12],
                    down: ['ArrowDown', 13],
                    left: ['ArrowLeft', 14],
                    right: ['ArrowRight', 15],
                    a: ['KeyZ', 0],
                    b: ['KeyX', 1],
                    start: ['KeyQ', 9],
                    select: ['Enter', 8],
                },
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

describe('GB Settings', () => {
    test('Click on side panel', async () => {
        await SettingsPage.clickGBSidePanelButton();
        expect(await SettingsPage.getTitle()).toBe('Game Boy Controls');
    });

    test('Initial state', async () => {
        await SettingsPage.clickGBSidePanelButton();

        const keyboardButtons = await GBSettingsPanel.keyboardButtons();
        expect(keyboardButtons.length).toBe(8);
        const names = ['UP ARROW', 'DOWN ARROW', 'LEFT ARROW', 'RIGHT ARROW', 'Z', 'X', 'Q', 'ENTER'];
        for (let i = 0; i < 8; i++) {
            const button = keyboardButtons[i];
            const innerButton = await button.findElement(By.css('button'));
            expect(await innerButton.getText()).toBe(names[i]);
        }

        const saveButton = await GBSettingsPanel.saveButton();
        expect(await elementHasClass(saveButton, 'disabled')).toBe(true);
    });

    test('Changes should be saved', async () => {
        await SettingsPage.clickGBSidePanelButton();

        let keyboardButtons = await GBSettingsPanel.keyboardButtons();
        await keyboardButtons[0].click();

        const body = driver.findElement(By.css('body'));
        await body.sendKeys('=');

        // fetch buttons again
        keyboardButtons = await GBSettingsPanel.keyboardButtons();
        expect(await keyboardButtons[0].getText()).toBe('EQUAL');

        let saveButton = await GBSettingsPanel.saveButton();
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
        expected.gbControls.up[0] = 'Equal';

        expect(result).toEqual(expected);

        // Refresh the page
        await driver.navigate().refresh();
        await SettingsPage.clickGBSidePanelButton();

        keyboardButtons = await GBSettingsPanel.keyboardButtons();
        expect(await keyboardButtons[0].getText()).toBe('EQUAL');

        saveButton = await GBSettingsPanel.saveButton();
        expect(await elementHasClass(saveButton, 'disabled')).toBe(true);
    });

    test('Snapshot', () => {
        const tree = renderer.create(<GBSettings />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

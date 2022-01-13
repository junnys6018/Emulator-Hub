import _ from 'lodash';
import { driver, resetDriver, elementHasClass, getIndexedDBSettings } from '@/tests/selenium';
import { SettingsPage } from './__pageobjects__/settings-page';
import { NESSettingsPanel } from './__pageobjects__/nes-settings';
import { By } from 'selenium-webdriver';
import { defaultSettings } from '@/src/storage/user-data';

import React from 'react';
import renderer from 'react-test-renderer';
import NESSettings from './nes-settings';
import { HasGamepadProvider } from '@/src/gamepad';

beforeEach(async () => {
    await driver.navigate().to('http://localhost:8000/settings');
});

afterEach(async () => {
    resetDriver();
});

jest.setTimeout(15000);
jest.mock('../util/message');
jest.mock('../util/alert');

jest.mock('@/src/storage/user-data', () => {
    const originalModule = jest.requireActual('@/src/storage/user-data');
    const useUserProfile = jest.fn();
    useUserProfile.mockReturnValue([
        {
            profileImage: '/image.png',
            userName: 'Guest',
            settings: {
                nesControls: {
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

describe('NES Settings', () => {
    test('Click on side panel', async () => {
        await SettingsPage.clickNESSidePanelButton();
        expect(await SettingsPage.getTitle()).toBe('Nintendo Entertainment System Controls');
    });

    test('Initial state', async () => {
        await SettingsPage.clickNESSidePanelButton();

        const keyboardButtons = await NESSettingsPanel.keyboardButtons();
        expect(keyboardButtons.length).toBe(8);
        const names = ['UP ARROW', 'DOWN ARROW', 'LEFT ARROW', 'RIGHT ARROW', 'Z', 'X', 'Q', 'ENTER'];
        for (let i = 0; i < 8; i++) {
            expect(await keyboardButtons[i].getText()).toBe(names[i]);
        }

        const saveButton = await NESSettingsPanel.saveButton();
        expect(await elementHasClass(saveButton, 'disabled')).toBe(true);
    });

    test('Changes should be saved', async () => {
        await SettingsPage.clickNESSidePanelButton();

        let keyboardButtons = await NESSettingsPanel.keyboardButtons();
        await keyboardButtons[0].click();

        const body = driver.findElement(By.css('body'));
        await body.sendKeys('=');

        // fetch buttons again
        keyboardButtons = await NESSettingsPanel.keyboardButtons();
        expect(await keyboardButtons[0].getText()).toBe('EQUAL');

        let saveButton = await NESSettingsPanel.saveButton();
        expect(await elementHasClass(saveButton, 'disabled')).toBe(false);

        // Save settings
        await saveButton.click();

        // check indexeddb
        let result = await getIndexedDBSettings();

        const expected = _.cloneDeep(defaultSettings);
        expected.nesControls.up[0] = 'Equal';

        expect(result).toEqual(expected);

        // Refresh the page
        await driver.navigate().refresh();
        await SettingsPage.clickNESSidePanelButton();

        keyboardButtons = await NESSettingsPanel.keyboardButtons();
        expect(await keyboardButtons[0].getText()).toBe('EQUAL');

        saveButton = await NESSettingsPanel.saveButton();
        expect(await elementHasClass(saveButton, 'disabled')).toBe(true);

        // Reset to defaults
        const resetButton = await NESSettingsPanel.resetAllButton();
        await resetButton.click();
        await saveButton.click();

        // check indexeddb
        result = await getIndexedDBSettings();

        expect(result).toEqual(_.cloneDeep(defaultSettings));
    });

    test('Snapshot', () => {
        const tree = renderer
            .create(
                <HasGamepadProvider>
                    <NESSettings />
                </HasGamepadProvider>,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

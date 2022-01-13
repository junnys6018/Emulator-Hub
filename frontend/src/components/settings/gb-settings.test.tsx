import _ from 'lodash';
import { driver, resetDriver, elementHasClass, getIndexedDBSettings } from '@/tests/selenium';
import { SettingsPage } from './__pageobjects__/settings-page';
import { GBSettingsPanel } from './__pageobjects__/gb-settings';
import { By } from 'selenium-webdriver';
import { defaultSettings } from '@/src/storage/user-data';

import React from 'react';
import renderer from 'react-test-renderer';
import GBSettings from './gb-settings';
import { HasGamepadProvider } from '@/src/gamepad';

beforeEach(async () => {
    await driver.navigate().to('http://localhost:8000/settings');
});

afterEach(async () => {
    resetDriver();
});

jest.setTimeout(15000);

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

jest.mock('../util/message');
jest.mock('../util/alert');

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
            expect(await keyboardButtons[i].getText()).toBe(names[i]);
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
        let result = await getIndexedDBSettings();

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

        // Reset to defaults
        const resetButton = await GBSettingsPanel.resetAllButton();
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
                    <GBSettings />
                </HasGamepadProvider>,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

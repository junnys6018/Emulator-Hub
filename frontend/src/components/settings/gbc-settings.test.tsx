import _ from 'lodash';
import { driver, resetDriver, elementHasClass, getIndexedDBSettings } from '@/tests/selenium';
import { SettingsPage } from './__pageobjects__/settings-page';
import { GBCSettingsPanel } from './__pageobjects__/gbc-settings';
import { By } from 'selenium-webdriver';
import { defaultSettings } from '@/src/storage/user-data';

import React from 'react';
import renderer from 'react-test-renderer';
import GBCSettings from './gbc-settings';
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
    const useActiveUserProfile = jest.fn();
    useActiveUserProfile.mockReturnValue([
        {
            profileImage: '/image.png',
            userName: 'Guest',
            settings: {
                gbcControls: {
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
        useActiveUserProfile,
    };
});

jest.mock('../util/message');
jest.mock('../util/alert');

describe('GBC Settings', () => {
    test('Click on side panel', async () => {
        await SettingsPage.clickGBCSidePanelButton();
        expect(await SettingsPage.getTitle()).toBe('Game Boy Color Controls');
    });

    test('Initial state', async () => {
        await SettingsPage.clickGBCSidePanelButton();

        const keyboardButtons = await GBCSettingsPanel.keyboardButtons();
        expect(keyboardButtons.length).toBe(8);
        const names = ['UP ARROW', 'DOWN ARROW', 'LEFT ARROW', 'RIGHT ARROW', 'Z', 'X', 'Q', 'ENTER'];
        for (let i = 0; i < 8; i++) {
            expect(await keyboardButtons[i].getText()).toBe(names[i]);
        }

        const saveButton = await GBCSettingsPanel.saveButton();
        expect(await elementHasClass(saveButton, 'disabled')).toBe(true);
    });

    test('Changes should be saved', async () => {
        await SettingsPage.clickGBCSidePanelButton();

        let keyboardButtons = await GBCSettingsPanel.keyboardButtons();
        await keyboardButtons[0].click();

        const body = driver.findElement(By.css('body'));
        await body.sendKeys('=');

        // fetch buttons again
        keyboardButtons = await GBCSettingsPanel.keyboardButtons();
        expect(await keyboardButtons[0].getText()).toBe('EQUAL');

        let saveButton = await GBCSettingsPanel.saveButton();
        expect(await elementHasClass(saveButton, 'disabled')).toBe(false);

        // Save settings
        await saveButton.click();

        // check indexeddb
        let result = await getIndexedDBSettings();

        const expected = _.cloneDeep(defaultSettings);
        expected.gbcControls.up[0] = 'Equal';

        expect(result).toEqual(expected);

        // Refresh the page
        await driver.navigate().refresh();
        await SettingsPage.clickGBCSidePanelButton();

        keyboardButtons = await GBCSettingsPanel.keyboardButtons();
        expect(await keyboardButtons[0].getText()).toBe('EQUAL');

        saveButton = await GBCSettingsPanel.saveButton();
        expect(await elementHasClass(saveButton, 'disabled')).toBe(true);

        // Reset to defaults
        const resetButton = await GBCSettingsPanel.resetAllButton();
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
                    <GBCSettings />
                </HasGamepadProvider>,
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

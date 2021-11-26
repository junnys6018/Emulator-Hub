import { driver, resetDriver, elementHasClass } from '@/tests/selenium';
import { SettingsPage } from './__pageobjects__/settings-page';
import { GeneralSettingsPanel } from './__pageobjects__/general-settings-panel';
import { defaultSettings } from '@/src/storage/user-data';
import _ from 'lodash';

beforeEach(async () => {
    await driver.navigate().to('http://localhost:8000/settings');
});

afterEach(async () => {
    resetDriver();
});

describe('General Settings', () => {
    test('Click on side panel', async () => {
        await SettingsPage.clickGeneralSidePanelButton();
        expect(await SettingsPage.getTitle()).toBe('General');
    });

    test('Initial state', async () => {
        await SettingsPage.clickGeneralSidePanelButton();

        expect(await GeneralSettingsPanel.showHiddenGamesSwitch().isSelected()).toBe(false);
        const saveButton = await GeneralSettingsPanel.saveButton();
        expect(await elementHasClass(saveButton, 'disabled')).toBe(true);
    });

    test('Changes should be saved', async () => {
        await SettingsPage.clickGeneralSidePanelButton();
        await GeneralSettingsPanel.showHiddenGamesSwitch().click();

        expect(await GeneralSettingsPanel.showHiddenGamesSwitch().isSelected()).toBe(true);
        let saveButton = await GeneralSettingsPanel.saveButton();
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
        expected.general.showHiddenGames = true;

        expect(result).toEqual(expected);

        await driver.navigate().refresh();

        expect(await GeneralSettingsPanel.showHiddenGamesSwitch().isSelected()).toBe(true);
        saveButton = await GeneralSettingsPanel.saveButton();
        expect(await elementHasClass(saveButton, 'disabled')).toBe(true);
    });
});

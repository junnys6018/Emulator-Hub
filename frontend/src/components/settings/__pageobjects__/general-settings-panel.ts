import { By } from 'selenium-webdriver';
import { findElementBy } from '@/tests/selenium';
import { SettingsPanel } from './settings-page';

export class GeneralSettingsPanel extends SettingsPanel {
    private static get showHiddenGamesSwitchLocator() {
        return By.css("input[type='checkbox']");
    }

    static showHiddenGamesSwitch() {
        return findElementBy(GeneralSettingsPanel.showHiddenGamesSwitchLocator);
    }
}

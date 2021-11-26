import { By } from 'selenium-webdriver';
import { findElementsBy } from '@/tests/selenium';
import { SettingsPanel } from './settings-page';

export class CHIP8SettingsPanel extends SettingsPanel {
    private static get buttonsLocator() {
        return By.css('div.settings__chip8-grid > *');
    }

    static async keyboardButtons() {
        return findElementsBy(CHIP8SettingsPanel.buttonsLocator);
    }
}

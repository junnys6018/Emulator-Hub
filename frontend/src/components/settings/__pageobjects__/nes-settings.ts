import { By } from 'selenium-webdriver';
import { findElementsBy } from '@/tests/selenium';
import { SettingsPanel } from './settings-page';

export class NESSettingsPanel extends SettingsPanel {
    private static get buttonsLocator() {
        return By.css('div.settings__controller-grid > *');
    }

    static async keyboardButtons() {
        const elements = await findElementsBy(NESSettingsPanel.buttonsLocator);
        // Select all the keyboard buttons from the grid
        return elements.filter((_element, index) => {
            return index % 3 === 1 && index !== 1;
        });
    }
}

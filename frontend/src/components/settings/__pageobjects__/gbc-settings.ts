import { By } from 'selenium-webdriver';
import { findElementsBy } from '@/tests/selenium';
import { SettingsPanel } from './settings-page';

export class GBCSettingsPanel extends SettingsPanel {
    private static get buttonsLocator() {
        return By.css('div.grid > *');
    }

    static async keyboardButtons() {
        const elements = await findElementsBy(GBCSettingsPanel.buttonsLocator);
        // Select all the keyboard buttons from the grid
        return elements.filter((_element, index) => {
            return index % 3 === 1 && index !== 1;
        });
    }
}

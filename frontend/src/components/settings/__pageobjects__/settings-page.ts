import { By } from 'selenium-webdriver';
import { findElementBy } from '@/tests/selenium';

export class SettingsPanel {
    private static get saveButtonLocator() {
        return By.xpath("//button[text()='Save']");
    }

    private static get resetAllButtonLocator() {
        return By.xpath("//button[text()='Reset All']");
    }

    static saveButton() {
        return findElementBy(SettingsPanel.saveButtonLocator);
    }

    static resetAllButton() {
        return findElementBy(SettingsPanel.resetAllButtonLocator);
    }
}

export class SettingsPage {
    private static sidePanelButtonLocator(panel: string) {
        return By.xpath(`//div[contains(@class, 'settings__button')]/button[text()='${panel}']`);
    }

    private static get titleLocator() {
        return By.css('h1');
    }

    static getTitle() {
        return findElementBy(SettingsPage.titleLocator).getText();
    }

    static clickGeneralSidePanelButton() {
        return findElementBy(SettingsPage.sidePanelButtonLocator('General')).click();
    }

    static clickNESSidePanelButton() {
        return findElementBy(SettingsPage.sidePanelButtonLocator('NES')).click();
    }

    static clickGBSidePanelButton() {
        return findElementBy(SettingsPage.sidePanelButtonLocator('GB')).click();
    }

    static clickGBCSidePanelButton() {
        return findElementBy(SettingsPage.sidePanelButtonLocator('GBC')).click();
    }

    static clickCHIP8SidePanelButton() {
        return findElementBy(SettingsPage.sidePanelButtonLocator('CHIP 8')).click();
    }
}

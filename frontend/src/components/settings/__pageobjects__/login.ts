import { findElementBy } from '@/tests/selenium';
import { By } from 'selenium-webdriver';

export class LoginPage {
    private static addProfileLocator() {
        return By.css('button.add-profile');
    }

    private static saveProfileLocator() {
        return By.xpath("//button[text()='Save']");
    }

    private static profileIconLocator() {
        return By.css('button.profile-icon');
    }

    static clickAddProfile() {
        return findElementBy(LoginPage.addProfileLocator()).click();
    }

    static clickSaveButton() {
        return findElementBy(LoginPage.saveProfileLocator()).click();
    }

    static clickProfileIcon() {
        return findElementBy(LoginPage.profileIconLocator()).click();
    }
}

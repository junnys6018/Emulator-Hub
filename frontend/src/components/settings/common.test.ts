import { driver } from '@/tests/selenium';
import { LoginPage } from './__pageobjects__/login';

export default async function createUser() {
    await driver.navigate().to('http://localhost:8000/login');
    await LoginPage.clickAddProfile();
    await LoginPage.clickSaveButton();
    await LoginPage.clickProfileIcon();
}

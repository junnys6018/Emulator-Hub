import { Builder, Locator, until, WebElement } from 'selenium-webdriver';
import { Browser, PageLoadStrategy } from 'selenium-webdriver/lib/capabilities';
import chrome from 'selenium-webdriver/chrome';
import 'chromedriver';

const options = new chrome.Options();

options
    .addArguments(
        '--ignore-certificate-errors',
        '--disable-extensions',
        '--disable-popup-blocking',
        '--incognito',
        '--window-size=1920,1080',
        'enable-automation',
    )
    .headless()
    .setPageLoadStrategy(PageLoadStrategy.NORMAL);

const builder = new Builder().forBrowser(Browser.CHROME).setChromeOptions(options);

export let driver = builder.build();

export function resetDriver() {
    driver.close();
    driver = builder.build();
}

export function findElementsBy(locator: Locator) {
    return driver.wait(until.elementsLocated(locator), 20000);
}

export function findElementBy(locator: Locator) {
    const webElement = driver.wait(until.elementLocated(locator), 20000);
    return driver.wait(until.elementIsVisible(webElement), 20000);
}

export function elementHasClass(element: WebElement, className: string) {
    return element
        .getAttribute('class')
        .then(classNames => classNames.split(' '))
        .then(classList => classList.includes(className));
}

export async function getIndexedDBSettings() {
    return await driver.executeScript(async () => {
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
}

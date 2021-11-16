/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { EmulatorHubDB, initializeDatabase, createGuestAccount } from './storage';
import { generateGuestAccount } from './user-data';
import { openDB } from 'idb';

jest.mock('./user-data', () => {
    const originalModule = jest.requireActual('./user-data');
    return {
        __esModule: true,
        ...originalModule,
        generateGuestAccount: jest.fn(),
    };
});

jest.mock('./db-connection', () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});

beforeEach(done => {
    localStorage.clear();

    const request = indexedDB.deleteDatabase('emulator-hub');
    request.onsuccess = () => done();
    request.onerror = e => console.log(e);
});

test('initializeDatabase() with guest-uuid already set', async () => {
    localStorage.setItem('guest-uuid', 'mock');
    await initializeDatabase();
    const db = await openDB<EmulatorHubDB>('emulator-hub');
    const users = await db.getAll('users');
    expect(users.length).toBe(0);
    db.close();
});

test('initializeDatabase() setups up correct initial state', async () => {
    (generateGuestAccount as jest.Mock<any, any>).mockReturnValueOnce({
        uuid: 'mock',
        age: 0,
        userName: 'Guest',
        profileImage: '/image.png',
    });

    await initializeDatabase();
    const db = await openDB<EmulatorHubDB>('emulator-hub');
    const users = await db.getAll('users');
    expect(users).toEqual([
        {
            uuid: 'mock',
            age: 0,
            userName: 'Guest',
            profileImage: '/image.png',
        },
    ]);
    expect(localStorage.getItem('guest-uuid')).toEqual('mock');
    db.close();
});

test('createGuestAccount() with uuid collision', async () => {
    (generateGuestAccount as jest.Mock<any, any>)
        .mockReturnValueOnce({
            uuid: 'mock',
            age: 0,
            userName: 'Guest',
            profileImage: '/image.png',
        })
        .mockReturnValueOnce({
            uuid: 'mock',
            age: 0,
            userName: 'Another Guest',
            profileImage: '/image.png',
        });

    await initializeDatabase();
    const db = await openDB<EmulatorHubDB>('emulator-hub');

    // create guest account
    await createGuestAccount(db);
    const users = await db.getAll('users');
    expect(users.length).toBe(2);
    expect(users).toContainEqual({
        uuid: 'mock',
        age: 0,
        userName: 'Guest',
        profileImage: '/image.png',
    });
    const otherUser = users.find(user => user.uuid != 'mock');
    expect(otherUser).toMatchObject({
        age: 0,
        userName: 'Another Guest',
        profileImage: '/image.png',
    });
    expect(localStorage.getItem('guest-uuid')).toEqual(otherUser?.uuid);
    db.close();
});

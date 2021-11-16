/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmulatorHubDB, createGuestAccount, initializeDatabase } from './storage';
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

jest.mock('../components/util/alert', () => {
    return {
        __esModule: true,
        useAlert: jest.fn(),
    };
});

beforeEach(() => {
    localStorage.clear();
});

test('<DatabaseProvider /> setups up correct initial state', async () => {
    (generateGuestAccount as jest.Mock<any, any>).mockReturnValueOnce({
        uuid: 'mock',
        age: 0,
        userName: 'Guest',
        profileImage: '/image.png',
    });

    await initializeDatabase('test 2');
    const db = await openDB<EmulatorHubDB>('test 2');
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
});

test('<DatabaseProvider /> with guest-uuid already set', async () => {
    localStorage.setItem('guest-uuid', 'mock');
    await initializeDatabase('test 1');
    const db = await openDB<EmulatorHubDB>('test 1');
    const users = await db.getAll('users');
    expect(users.length).toBe(0);
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

    await initializeDatabase('test 3');
    const db = await openDB<EmulatorHubDB>('test 3');

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
});

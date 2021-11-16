import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { generateGuestAccount, UserData } from './user-data';
import { v4 as uuidv4 } from 'uuid';

export interface Record {
    uuid: string;
    age: number;
}

export interface EmulatorHubDB extends DBSchema {
    users: {
        value: UserData;
        key: string;
    };
}

export async function createGuestAccount(db: IDBPDatabase<EmulatorHubDB>) {
    console.log('[INFO] No guest account found, generating one');
    const guestUser = await generateGuestAccount();

    const addGuestAccount = async () => {
        try {
            await db.add('users', guestUser);
        } catch (error) {
            if (error.name === 'ConstraintError') {
                console.warn('[WARN] primary key collision, regenerating uuid');
                guestUser.uuid = uuidv4();
                await addGuestAccount();
            } else {
                throw error;
            }
        }
    };
    await addGuestAccount();

    localStorage.setItem('guest-uuid', guestUser.uuid);
    // Dispatch a storage event, this event is not triggered on the window object that modified localStorage
    // so we do it manually
    const event = new StorageEvent('storage', {
        key: 'guest-uuid',
        newValue: guestUser.uuid,
    });
    window.dispatchEvent(event);
}

export async function initializeDatabase() {
    const db = await openDB<EmulatorHubDB>('emulator-hub', 1, {
        upgrade(db, oldVersion) {
            switch (oldVersion) {
                case 0:
                    // database didnt exist, initialize schema
                    console.log('[INFO] Upgrading database to version 1');
                    db.createObjectStore('users', { keyPath: 'uuid' });
            }
        },
        //blocked() {},
        blocking() {
            db.close();
            alert('The application is outdated, please reload the page');
        },
        terminated() {
            alert('[FATAL] database connection was unexpectedly closed');
        },
    });

    // Check if a guest account exists, if not create one
    const guestUuid = localStorage.getItem('guest-uuid');
    if (!guestUuid) {
        await createGuestAccount(db);
    }

    db.close();
}

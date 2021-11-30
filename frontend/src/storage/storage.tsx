import { openDB, DBSchema, IDBPDatabase, OpenDBCallbacks } from 'idb';
import { generateGuestAccount, UserData } from './user-data';
import { v4 as uuidv4 } from 'uuid';
import React, { useContext, useEffect, useState } from 'react';
import { useAlert } from '../components/util/alert';
import { GameData, GameMetaData } from './game-data';

export interface Record {
    uuid: string;
    age: number;
}

export interface EmulatorHubDB extends DBSchema {
    users: {
        value: UserData;
        key: string;
    };
    gameMetaData: {
        value: GameMetaData;
        key: string;
        indexes: { 'by-user': string };
    };
    gameData: {
        value: GameData;
        key: string;
        indexes: { 'by-user': string };
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
}

const DatabaseContext = React.createContext<IDBPDatabase<EmulatorHubDB> | null>(null);

export async function initializeDatabase(name: string, options?: OpenDBCallbacks<EmulatorHubDB>) {
    const db = await openDB<EmulatorHubDB>(name, 1, {
        upgrade(db, oldVersion) {
            switch (oldVersion) {
                case 0:
                    // database didnt exist, initialize schema
                    console.log('[INFO] Upgrading database to version 1');
                    db.createObjectStore('users', { keyPath: 'uuid' });

                    const gameMetaData = db.createObjectStore('gameMetaData', { keyPath: 'uuid' });
                    gameMetaData.createIndex('by-user', 'user');

                    const gameData = db.createObjectStore('gameData', { keyPath: 'uuid' });
                    gameData.createIndex('by-user', 'user');
            }
        },
        blocked: options?.blocked,
        blocking() {
            db.close();
            if (options?.blocking) options.blocking();
        },
        terminated: options?.terminated,
    });

    // Check if a guest account exists, if not create one
    const guestUuid = localStorage.getItem('guest-uuid');
    if (!guestUuid) {
        await createGuestAccount(db);
    }

    return db;
}

export function DatabaseProvider(props: { children?: React.ReactNode; name?: string }) {
    const [db, setDb] = useState<IDBPDatabase<EmulatorHubDB> | null>(null);
    const alert = useAlert();

    const name = props.name ?? 'emulator-hub';

    useEffect(() => {
        initializeDatabase(name, {
            blocking() {
                alert('The application is outdated, please reload the page', {
                    action: 'REFRESH',
                });
            },
            terminated() {
                alert('The database connection was unexpectedly closed', {
                    severity: 'ERROR',
                    action: 'REFRESH',
                });
            },
        }).then(db => setDb(db));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <DatabaseContext.Provider value={db}>{db !== null && props.children}</DatabaseContext.Provider>;
}

export function useDatabase() {
    const db = useContext(DatabaseContext);
    if (db === null) {
        throw new Error('useDatabase must be used within DatabaseProvider');
    }
    return db;
}

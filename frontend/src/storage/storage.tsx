import { openDB, DBSchema, IDBPDatabase, OpenDBCallbacks } from 'idb';
import { UserData } from './user-data';
import React, { useContext, useEffect, useState } from 'react';
import { useAlert } from '../components/util/alert';
import { GameData, GameMetaData } from './game-data';
import getActiveUserUuid from './get-active-user';

export interface Record {
    uuid: string;
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
        }).then(async db => {
            // Health Check
            const activeUuid = getActiveUserUuid();
            if (activeUuid !== null) {
                const user = await db.get('users', activeUuid);
                if (user === undefined) {
                    // active-uuid points to non-existent user
                    console.log('[WARN] active-uuid did not point to a valid user');
                    localStorage.removeItem('active-uuid');
                }
            }

            setDb(db);
        });
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

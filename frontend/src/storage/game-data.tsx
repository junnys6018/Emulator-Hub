import { IDBPDatabase } from 'idb';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import getActiveUserUuid from './get-active-user';
import { EmulatorHubDB, Record, useDatabase } from './storage';
export type Console = 'NES' | 'GB' | 'GBC' | 'CHIP 8';

export interface GameMetaData extends Record {
    name: string;
    image: Blob;
    saveNames: string[];
    activeSaveIndex: number;
    console: Console;
    user: string; // UUID of the user to which this record belongs to
}

export interface GameMetaDataView {
    name: string;
    image: string;
    saveNames: string[];
    activeSaveIndex: number;
    console: Console;
    uuid: string;
}

interface Save extends Record {
    data: ArrayBuffer;
}

export interface GameData extends Record {
    rom: ArrayBuffer;
    saves: Save[];
    user: string; // UUID of the user to which this record belongs to
}

const GameMetaDataContext = React.createContext<
    [GameMetaDataView[], (newGameMetaData: RecursivePartial<GameMetaData>) => Promise<string>] | null
>(null);

export function GameMetaDataProvider(props: { children: React.ReactNode }) {
    const [gameMetaDataView, setGameMetaData] = useState<GameMetaDataView[]>([]);

    const db = useDatabase();

    useEffect(() => {
        const activeUuid = getActiveUserUuid();
        const transaction = db.transaction('gameMetaData');
        const objectStore = transaction.objectStore('gameMetaData');
        const userIndex = objectStore.index('by-user');

        userIndex.getAll(activeUuid).then(gameMetaData => {
            const gameMetaDataView = [];
            for (const game of gameMetaData) {
                const image = URL.createObjectURL(game.image);
                gameMetaDataView.push({
                    name: game.name,
                    image: image,
                    saveNames: game.saveNames,
                    activeSaveIndex: game.activeSaveIndex,
                    console: game.console,
                    uuid: game.uuid,
                });
            }
            setGameMetaData(gameMetaDataView);
        });
    }, [db]);

    const putGameMetaData = async (newGameMetaData: Partial<GameMetaData>): Promise<string> => {
        const gameMetaData = await db.get('gameMetaData', newGameMetaData.uuid as string);
        if (gameMetaData !== undefined) {
            newGameMetaData = _.merge(gameMetaData, newGameMetaData);
        }

        // Clean up image url if we are updating an entry
        const existingGameMetaDataView = gameMetaDataView.filter(item => item.uuid === newGameMetaData.uuid)[0];
        if (existingGameMetaDataView !== undefined) {
            URL.revokeObjectURL(existingGameMetaDataView.image);
        }

        const newGameMetaDataView = gameMetaDataView.concat([
            {
                name: (newGameMetaData as GameMetaData).name,
                image: URL.createObjectURL((newGameMetaData as GameMetaData).image),
                saveNames: (newGameMetaData as GameMetaData).saveNames,
                activeSaveIndex: (newGameMetaData as GameMetaData).activeSaveIndex,
                console: (newGameMetaData as GameMetaData).console,
                uuid: (newGameMetaData as GameMetaData).uuid,
            },
        ]);
        setGameMetaData(newGameMetaDataView);

        return db.put('gameMetaData', newGameMetaData as GameMetaData);
    };

    return (
        <GameMetaDataContext.Provider value={[gameMetaDataView, putGameMetaData]}>
            {props.children}
        </GameMetaDataContext.Provider>
    );
}

export function useGameMetaData() {
    const context = useContext(GameMetaDataContext);
    if (!context) {
        throw new Error('useGameMetaData() must be called with a GameMetaDataProvider');
    }
    return context;
}

export function getGameData(db: IDBPDatabase<EmulatorHubDB>, uuid: string) {
    return db.get('gameData', uuid);
}

export async function putGameData(db: IDBPDatabase<EmulatorHubDB>, newGameData: Partial<GameData>) {
    const oldGameData = await db.get('gameData', newGameData.uuid as string);
    if (oldGameData !== undefined) {
        newGameData = _.merge(oldGameData, newGameData);
    }

    return db.put('gameData', newGameData as GameData);
}

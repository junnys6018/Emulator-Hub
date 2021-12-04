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
    settings: {
        hidden: boolean;
        deletable: boolean;
        imageRendering: 'pixelated' | 'unset';
        // If true, a screenshot of the game will be taken next time it is played and will be used as the image for this rom
        captureImage: boolean;
    };
}

export interface GameMetaDataView {
    name: string;
    image: string;
    saveNames: string[];
    activeSaveIndex: number;
    console: Console;
    settings: {
        hidden: boolean;
        deletable: boolean;
        imageRendering: 'pixelated' | 'unset';
        // If true, a screenshot of the game will be taken next time it is played and will be used as the image for this rom
        captureImage: boolean;
    };
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
                    settings: game.settings,
                });
            }
            setGameMetaData(gameMetaDataView);
        });
    }, [db]);

    // FIXME: Its unlikley, but possible that `putGameMetaData` is called before the effect hook finishes
    // could leave application in inconsistent state
    const putGameMetaData = async (newGameMetaData: Partial<GameMetaData> & { uuid: string }): Promise<string> => {
        console.log('[INFO] updating/adding new gameMetaData');

        const existingGameMetaDataView = gameMetaDataView.find(item => item.uuid === newGameMetaData.uuid);
        const overrideImage = existingGameMetaDataView !== undefined && newGameMetaData.image !== undefined;
        if (overrideImage) {
            URL.revokeObjectURL(existingGameMetaDataView.image);
        }

        const gameMetaData = await db.get('gameMetaData', newGameMetaData.uuid as string);
        const isNew = gameMetaData === undefined;
        if (!isNew) {
            // Merge with existing item if it exists
            newGameMetaData = _.merge(gameMetaData, newGameMetaData);
        }

        // Create the new view
        const newGameMetaDataView = {
            name: newGameMetaData.name,
            image:
                overrideImage || isNew ? URL.createObjectURL(newGameMetaData.image) : existingGameMetaDataView?.image,
            saveNames: newGameMetaData.saveNames,
            activeSaveIndex: newGameMetaData.activeSaveIndex,
            console: newGameMetaData.console,
            uuid: newGameMetaData.uuid,
            settings: newGameMetaData.settings,
        } as GameMetaDataView;

        setGameMetaData(gameMetaDataView => {
            if (isNew) {
                return gameMetaDataView.concat(newGameMetaDataView);
            } else {
                const uuid = newGameMetaData.uuid as string;
                // Make an in place merge with the existing item
                _.merge(
                    gameMetaDataView.find(item => item.uuid === uuid),
                    newGameMetaDataView,
                );
                // Create new array to force re-render
                return [...gameMetaDataView];
            }
        });

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

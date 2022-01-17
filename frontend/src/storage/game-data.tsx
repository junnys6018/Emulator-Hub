import { IDBPDatabase } from 'idb';
import _ from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import getActiveUserUuid from './get-active-user';
import { EmulatorHubDB, Record, useDatabase } from './storage';
import { v4 as uuidv4 } from 'uuid';
import createSave from '../emulators/create-save';

export type Console = 'NES' | 'GB' | 'GBC' | 'CHIP 8';

export interface GameSettings {
    hidden: boolean;
    deletable: boolean;
    imageRendering: 'pixelated' | 'unset';
    // If true, a screenshot of the game will be taken next time it is played and will be used as the image for this rom
    captureImage: boolean;
}

export interface GameMetaData extends Record {
    name: string;
    image: Blob;
    saveNames: string[];
    activeSaveIndex: number;
    console: Console;
    user: string; // UUID of the user to which this record belongs to
    settings: GameSettings;
}

export interface GameMetaDataView {
    name: string;
    image: string;
    saveNames: string[];
    activeSaveIndex: number;
    console: Console;
    settings: GameSettings;
    uuid: string;
}

interface Save extends Record {
    data: ArrayBuffer | null;
}

export interface GameData extends Record {
    rom: ArrayBuffer;
    saves: Save[];
    user: string; // UUID of the user to which this record belongs to
}

const GameMetaDataContext = React.createContext<
    | [
          GameMetaDataView[],
          (newGameMetaData: RecursivePartial<GameMetaData>) => Promise<void>,
          (uuid: string) => Promise<void>,
      ]
    | null // Used to indicate gameMetaData is still loading
    | undefined // Default value, used to indicate context is being used without a provider
>(undefined);

function sortGameMetaData(g1: GameMetaDataView, g2: GameMetaDataView): number {
    const name1 = g1.name.toLowerCase();
    const name2 = g2.name.toLowerCase();

    if (name1 === name2) {
        return 0;
    } else if (name1 < name2) {
        return -1;
    }
    return 1;
}

export function GameMetaDataProvider(props: { children: React.ReactNode }) {
    const [gameMetaDataView, setGameMetaDataView] = useState<GameMetaDataView[] | null>(null);

    const db = useDatabase();

    useEffect(() => {
        const activeUuid = getActiveUserUuid();
        const transaction = db.transaction('gameMetaData');
        const objectStore = transaction.objectStore('gameMetaData');
        const userIndex = objectStore.index('by-user');

        userIndex.getAll(activeUuid).then(gameMetaData => {
            const gameMetaDataView: GameMetaDataView[] = [];
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

            gameMetaDataView.sort(sortGameMetaData);

            setGameMetaDataView(gameMetaDataView);
        });
    }, [db]);

    /**
     * Puts a `GameMetaData` record in the database
     *
     * If the record already exists, the new record is merged with the old one
     */
    const putGameMetaData = useCallback(
        async (newGameMetaData: Partial<GameMetaData> & { uuid: string }): Promise<void> => {
            if (gameMetaDataView === null) {
                return;
            }

            console.log('[INFO] updating/adding new gameMetaData');

            const existingImageUrl = gameMetaDataView.find(item => item.uuid === newGameMetaData.uuid)?.image;
            const overrideImage = existingImageUrl !== undefined && newGameMetaData.image !== undefined;
            if (overrideImage) {
                URL.revokeObjectURL(existingImageUrl);
            }

            const gameMetaData = await db.get('gameMetaData', newGameMetaData.uuid);
            const isNew = gameMetaData === undefined;
            if (!isNew) {
                const saveNames = newGameMetaData.saveNames;
                // Merge with existing item if it exists
                newGameMetaData = _.merge(gameMetaData, newGameMetaData);

                if (saveNames !== undefined) {
                    // If saveNames was specified, we dont want to merge the saves together, instead we overwrite the saveNames
                    newGameMetaData.saveNames = saveNames;
                }
            }

            // Create the new view
            const newGameMetaDataView = {
                name: newGameMetaData.name,
                image: overrideImage || isNew ? URL.createObjectURL(newGameMetaData.image as Blob) : existingImageUrl,
                saveNames: newGameMetaData.saveNames,
                activeSaveIndex: newGameMetaData.activeSaveIndex,
                console: newGameMetaData.console,
                uuid: newGameMetaData.uuid,
                settings: newGameMetaData.settings,
            } as GameMetaDataView;

            setGameMetaDataView(gameMetaDataView => {
                if (gameMetaDataView === null) {
                    return null;
                }

                if (isNew) {
                    return gameMetaDataView.concat(newGameMetaDataView).sort(sortGameMetaData);
                } else {
                    const uuid = newGameMetaData.uuid;

                    // Update the existing view, its important that we update the item instead of replacing it
                    // because code might save a reference to the view, in which case it will be holding onto
                    // a 'stale' reference of the view.
                    const existingGameMetaDataView = gameMetaDataView.find(
                        item => item.uuid === uuid,
                    ) as GameMetaDataView;
                    _.merge(existingGameMetaDataView, newGameMetaDataView);
                    existingGameMetaDataView.saveNames = newGameMetaDataView.saveNames;

                    // Create new array to force re-render
                    return [...gameMetaDataView].sort(sortGameMetaData);
                }
            });

            await db.put('gameMetaData', newGameMetaData as GameMetaData);
        },
        [db, gameMetaDataView],
    );

    const deleteGame = useCallback(
        async (uuid: string) => {
            // Delete the metadata
            setGameMetaDataView(gameMetaDataView => {
                if (gameMetaDataView === null) {
                    return null;
                }
                return gameMetaDataView.filter(value => value.uuid !== uuid);
            });

            // TODO: make this a single transaction
            await db.delete('gameMetaData', uuid);

            // Delete the game data
            await db.delete('gameData', uuid);
        },
        [db],
    );

    return (
        <GameMetaDataContext.Provider
            value={gameMetaDataView === null ? null : [gameMetaDataView, putGameMetaData, deleteGame]}
        >
            {gameMetaDataView !== null && props.children}
        </GameMetaDataContext.Provider>
    );
}

export function useGameMetaData() {
    const context = useContext(GameMetaDataContext);
    if (context === undefined) {
        throw new Error('useGameMetaData() must be called with a GameMetaDataProvider');
    } else if (context === null) {
        throw new Error('[BUG] useGameMetaData() called before data is loaded');
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

export async function addSaveGame(db: IDBPDatabase<EmulatorHubDB>, uuid: string) {
    const gameData = await db.get('gameData', uuid);
    const gameMetaData = await db.get('gameMetaData', uuid);

    if (gameData === undefined || gameMetaData === undefined) {
        throw new Error('Invalid uuid');
    }

    gameData.saves.push({
        data: createSave(new Uint8Array(gameData.rom), gameMetaData.console),
        uuid: uuidv4(),
    });

    return db.put('gameData', gameData);
}

export async function deleteSaveGames(db: IDBPDatabase<EmulatorHubDB>, uuid: string, indices: Set<number>) {
    const gameData = await db.get('gameData', uuid);

    if (gameData === undefined) {
        throw new Error('Invalid uuid');
    }

    const newSaves = gameData.saves.filter((_, index) => !indices.has(index));
    gameData.saves = newSaves;

    return db.put('gameData', gameData);
}

export async function updateSave(db: IDBPDatabase<EmulatorHubDB>, uuid: string, index: number, save: ArrayBuffer) {
    const gameData = await db.get('gameData', uuid);
    if (gameData === undefined) {
        throw new Error('Invalid uuid');
    }

    gameData.saves[index].data = save;
    return db.put('gameData', gameData);
}

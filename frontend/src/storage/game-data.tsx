export type Console = 'NES' | 'GB' | 'GBC' | 'CHIP 8';

interface Record {
    uuid: string;
    age: number;
}

export interface GameMetaData extends Record {
    name: string;
    image: string;
    saveNames: string[];
    activeSaveIndex: number;
    console: Console;
}

interface Save extends Record {
    name: string;
    data: ArrayBuffer;
}

export interface GameData {
    rom: ArrayBuffer;
    saves: Save[];
}

import SMB from '@/public/assets/SMB.png';
export function useGameMetaData(): GameMetaData[] {
    return [
        {
            name: 'Super Mario Bros',
            image: SMB,
            saveNames: ['Save 1', 'Save 2', 'Save 3'],
            activeSaveIndex: 1,
            console: 'NES',
            uuid: '1',
            age: 0,
        },
        {
            name: 'Zelda',
            image: SMB,
            saveNames: ['Save 1'],
            activeSaveIndex: 0,
            console: 'NES',
            uuid: '2',
            age: 0,
        },
        {
            name: 'Donkey Kong',
            image: SMB,
            saveNames: ['Save 1'],
            activeSaveIndex: 0,
            console: 'NES',
            uuid: '3',
            age: 0,
        },
        {
            name: 'Mario Cart',
            image: SMB,
            saveNames: ['Save 1'],
            activeSaveIndex: 0,
            console: 'NES',
            uuid: '4',
            age: 0,
        },
        {
            name: 'Pokemon',
            image: SMB,
            saveNames: ['Save 1'],
            activeSaveIndex: 0,
            console: 'GB',
            uuid: '5',
            age: 0,
        },
        {
            name: 'Super Mario World',
            image: SMB,
            saveNames: ['Save 1'],
            activeSaveIndex: 0,
            console: 'GBC',
            uuid: '6',
            age: 0,
        },
        {
            name: 'Tetris',
            image: SMB,
            saveNames: ['Save 1'],
            activeSaveIndex: 0,
            console: 'GBC',
            uuid: '7',
            age: 0,
        },
    ];
}

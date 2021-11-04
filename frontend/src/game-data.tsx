export type Console = 'NES' | 'GB' | 'GBC' | 'CHIP 8';

export interface GameMetaData {
    name: string;
    image: string;
    saveNames: string[];
    activeSaveIndex: number;
    console: Console;
    uuid: string;
}

interface Save {
    name: string;
    data: ArrayBuffer;
}

export interface GameData {
    rom: ArrayBuffer;
    saves: Save[];
    uuid: string;
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
        },
        {
            name: 'Zelda',
            image: SMB,
            saveNames: ['Save 1'],
            activeSaveIndex: 0,
            console: 'NES',
            uuid: '2',
        },
        {
            name: 'Donkey Kong',
            image: SMB,
            saveNames: ['Save 1'],
            activeSaveIndex: 0,
            console: 'NES',
            uuid: '3',
        },
        {
            name: 'Mario Cart',
            image: SMB,
            saveNames: ['Save 1'],
            activeSaveIndex: 0,
            console: 'NES',
            uuid: '4',
        },
        {
            name: 'Pokemon',
            image: SMB,
            saveNames: ['Save 1'],
            activeSaveIndex: 0,
            console: 'GB',
            uuid: '5',
        },
        {
            name: 'Super Mario World',
            image: SMB,
            saveNames: ['Save 1'],
            activeSaveIndex: 0,
            console: 'GBC',
            uuid: '6',
        },
        {
            name: 'Tetris',
            image: SMB,
            saveNames: ['Save 1'],
            activeSaveIndex: 0,
            console: 'GBC',
            uuid: '7',
        },
    ];
}

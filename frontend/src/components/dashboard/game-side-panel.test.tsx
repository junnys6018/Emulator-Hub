/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import renderer from 'react-test-renderer';
import GameSidePanel, { newSaveIndex } from './game-side-panel';
import { useGameMetaData } from '@/src/storage/game-data';

jest.mock('@/src/storage/game-data');
jest.mock('../util/alert');

test('<GameSidePanel /> snapshot', () => {
    const props = {
        image: '/image.png',
        imageRendering: 'pixelated' as const,
        name: 'Zelda',
        gameUuid: 'mock',
        saveNames: ['Save 1', 'Save 2', 'Save 3'],
        activeSaveIndex: 1,
        closePanel: () => {},
    };

    (useGameMetaData as jest.Mock<any, any>).mockReturnValueOnce([, jest.fn()]);

    const tree = renderer.create(<GameSidePanel {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
});

test('newSaveIndex', () => {
    expect(newSaveIndex(new Set([]), 3)).toBe(3);
    expect(newSaveIndex(new Set([4, 5, 6]), 3)).toBe(3);
    expect(newSaveIndex(new Set([1, 4, 5]), 3)).toBe(2);
    expect(newSaveIndex(new Set([3]), 3)).toBe(0);
    expect(newSaveIndex(new Set([1, 2, 6]), 3)).toBe(1);
    expect(newSaveIndex(new Set([0, 1, 2, 6]), 3)).toBe(0);
    expect(newSaveIndex(new Set([0]), 3)).toBe(2);
});

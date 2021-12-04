/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import renderer from 'react-test-renderer';
import GameSidePanel from './game-side-panel';
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

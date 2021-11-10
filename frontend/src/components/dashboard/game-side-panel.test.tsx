/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import renderer from 'react-test-renderer';
import GameSidePanel from './game-side-panel';

test('<GameSidePanel /> snapshot', () => {
    const props = {
        image: '/image.png',
        name: 'Zelda',
        saveNames: ['Save 1', 'Save 2', 'Save 3'],
        activeSaveIndex: 1,
        closePanel: () => {},
    };
    const tree = renderer.create(<GameSidePanel {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
});

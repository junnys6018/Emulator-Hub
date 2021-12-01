/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import renderer from 'react-test-renderer';
import GameItem, { GameCard, GameListItem } from './game-item';

const props = {
    image: '/image.png',
    imageRendering: 'pixelated' as const,
    name: 'Zelda',
    onActiveCallback() {},
};

test('<GameCard /> snapshot', () => {
    const tree = renderer.create(<GameCard {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
});

test('<GameListItem /> snapshot', () => {
    const tree = renderer.create(<GameListItem {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
});

test('<GameItem /> snapshot', () => {
    const tree = renderer.create(<GameItem {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
});

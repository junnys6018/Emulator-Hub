/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import renderer from 'react-test-renderer';
import GameItem, { GameCard, GameItemProps, GameListItem } from './game-item';
import { MemoryRouter } from 'react-router';

const props: GameItemProps = {
    image: '/image.png',
    gameUuid: 'mock',
    console: 'CHIP 8',
    imageRendering: 'pixelated' as const,
    name: 'Zelda',
    onActiveCallback() {},
};

test('<GameCard /> snapshot', () => {
    const tree = renderer
        .create(
            <MemoryRouter>
                <GameCard {...props} />
            </MemoryRouter>,
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

test('<GameListItem /> snapshot', () => {
    const tree = renderer
        .create(
            <MemoryRouter>
                <GameListItem {...props} />
            </MemoryRouter>,
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

test('<GameItem /> snapshot', () => {
    const tree = renderer
        .create(
            <MemoryRouter>
                <GameItem {...props} />
            </MemoryRouter>,
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

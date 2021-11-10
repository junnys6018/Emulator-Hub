/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import renderer from 'react-test-renderer';
import Navbar from './navbar';
import { MemoryRouter } from 'react-router';

test('<Navbar /> snapshot', () => {
    const component = renderer.create(
        <MemoryRouter>
            <Navbar profileImage="/profile.png" userName="Jun Lim" searchQuery="" setSearchQuery={() => {}} />
        </MemoryRouter>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

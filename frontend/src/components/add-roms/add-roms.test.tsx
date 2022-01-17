/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router';

import AddRoms from './add-roms';

import { useActiveUserProfile } from '@/src/storage/user-data';

jest.mock('../util/message');
jest.mock('../util/alert');
jest.mock('@/src/storage/user-data');

test('<AddRoms /> snapshot', () => {
    (useActiveUserProfile as jest.Mock<any, any>).mockReturnValue([{ userName: 'Jun Lim', profileImage: '/image.png' }]);
    const tree = renderer
        .create(
            <MemoryRouter>
                <AddRoms />
            </MemoryRouter>,
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

import React from 'react';
import renderer from 'react-test-renderer';
import NotFound from './not-found';
import { MemoryRouter } from 'react-router';

jest.mock('@/src/storage/user-data', () => {
    const useActiveUserProfile = jest.fn();
    useActiveUserProfile.mockReturnValueOnce([
        {
            userName: 'Jun Lim',
            profileImage: 'mock image',
        },
    ]);
    return {
        __esModule: true,
        useActiveUserProfile,
    };
});

test('<NotFound /> snapshot', () => {
    const tree = renderer
        .create(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>,
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

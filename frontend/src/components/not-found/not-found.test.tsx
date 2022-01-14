import React from 'react';
import renderer from 'react-test-renderer';
import NotFound from './not-found';
import { MemoryRouter } from 'react-router';

jest.mock('@/src/storage/user-data', () => {
    const useUserProfile = jest.fn();
    useUserProfile.mockReturnValueOnce([
        {
            userName: 'Jun Lim',
            profileImage: 'mock image',
        },
    ]);
    return {
        __esModule: true,
        useUserProfile,
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

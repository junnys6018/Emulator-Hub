import React from 'react';
import renderer from 'react-test-renderer';
import NotFound from './not-found';
import { MemoryRouter } from 'react-router';
import getActiveUserUuid from '@/src/storage/get-active-user';

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

jest.mock('@/src/storage/get-active-user');

test('<NotFound /> snapshot', () => {
    (getActiveUserUuid as jest.Mock).mockReturnValueOnce('mock-uuid');

    const tree = renderer
        .create(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>,
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

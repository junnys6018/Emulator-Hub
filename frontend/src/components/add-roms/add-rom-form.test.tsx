/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import renderer from 'react-test-renderer';
import AddRomForm from './add-rom-form';
import 'jest-fetch-mock';

jest.mock('@/src/storage/game-data', () => {
    const useGameMetaData = jest.fn();
    useGameMetaData.mockReturnValue([undefined, jest.fn()]);
    return {
        __esModule: true,
        useGameMetaData,
    };
});
jest.mock('@/src/storage/storage');
jest.mock('../util/alert');
jest.mock('../util/message');

test('<AddRomForm /> snapshot', () => {
    fetchMock.mockResponseOnce('mock');
    const file = new File([], 'test');
    const tree = renderer
        .create(<AddRomForm id={0} initialName="" inititalConsole="NES" file={file} onDelete={() => {}} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

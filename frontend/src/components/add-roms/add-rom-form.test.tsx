/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import renderer from 'react-test-renderer';
import AddRomForm from './add-rom-form';

test('<AddRomForm /> snapshot', () => {
    const file = new File([], 'test');
    const tree = renderer
        .create(<AddRomForm id={0} initialName="" inititalConsole="NES" file={file} onDelete={() => {}} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

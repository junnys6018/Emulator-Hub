import React from 'react';
import renderer from 'react-test-renderer';
import AddRomForm from './add-rom-form';

test('<AddRomForm /> snapshot', () => {
    const tree = renderer.create(<AddRomForm id={0} />).toJSON();
    expect(tree).toMatchSnapshot();
});

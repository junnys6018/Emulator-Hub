import React from 'react';
import renderer from 'react-test-renderer';
import NotFound from './not-found';

test('<NotFound /> snapshot', () => {
    const tree = renderer.create(<NotFound />).toJSON();
    expect(tree).toMatchSnapshot();
});

import React from 'react';
import renderer from 'react-test-renderer';
import Footer from './footer';

test('<Footer /> snapshot', () => {
    const tree = renderer.create(<Footer />).toJSON();
    expect(tree).toMatchSnapshot();
});

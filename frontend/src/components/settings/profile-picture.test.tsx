import React from 'react';
import renderer from 'react-test-renderer';
import ProfilePicture from './profile-picture';

test('<ProfilePicture /> snapshot', () => {
    const tree = renderer.create(<ProfilePicture size="200px" profileImage="/image.png" />).toJSON();
    expect(tree).toMatchSnapshot();
});

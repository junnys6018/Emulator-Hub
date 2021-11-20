/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import renderer from 'react-test-renderer';
import { Message } from './message';

test('<Message /> snapshot', () => {
    const tree = renderer
        .create(<Message title="Message" message="This is a message" severity="SUCCESS" close={() => {}} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

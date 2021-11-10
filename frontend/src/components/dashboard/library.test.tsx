import React from 'react';
import renderer from 'react-test-renderer';
import Library from './library';

test('<Library /> renders null', () => {
    const tree = renderer.create(<Library console="CHIP 8">{null}</Library>).toJSON();
    expect(tree).toMatchSnapshot();
});

test('<Library /> renders children', () => {
    const tree = renderer
        .create(
            <Library console="CHIP 8">
                <span>child 1</span>
                <span>child 2</span>
            </Library>,
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

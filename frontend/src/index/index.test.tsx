import React from 'react';
import { MemoryRouter } from 'react-router';
import renderer from 'react-test-renderer';
import Index from './index';

test('example snapshot test', () => {
    const component = renderer.create(
        <MemoryRouter>
            <Index />
        </MemoryRouter>,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

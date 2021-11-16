/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import renderer from 'react-test-renderer';
import { Alert, AlertContext } from './alert';

test('<Alert /> snapshot', () => {
    const tree = renderer
        .create(
            <AlertContext.Provider value={() => {}}>
                <Alert title="Alert" message="This is an alert" severity="ERROR" action="CLOSE" />
            </AlertContext.Provider>,
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

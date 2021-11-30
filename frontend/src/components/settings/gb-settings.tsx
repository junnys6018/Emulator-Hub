import React, { Fragment } from 'react';
import { makeControllerSettingsComponent, SettingsTitle } from './common';

const Component = makeControllerSettingsComponent('gbControls');

export default function GBSettings() {
    return (
        <Fragment>
            <SettingsTitle title="Game Boy Controls" />
            <Component />
        </Fragment>
    );
}

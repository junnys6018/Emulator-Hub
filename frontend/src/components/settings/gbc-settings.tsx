import React, { Fragment } from 'react';
import { makeControllerSettingsComponent, SettingsTitle } from './common';

const Component = makeControllerSettingsComponent('gbcControls');

export default function GBCSettings() {
    return (
        <Fragment>
            <SettingsTitle title="Game Boy Color Controls" />
            <Component />
        </Fragment>
    );
}

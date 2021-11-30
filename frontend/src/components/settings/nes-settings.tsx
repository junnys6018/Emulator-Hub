import React, { Fragment } from 'react';
import { makeControllerSettingsComponent, SettingsTitle } from './common';

const Component = makeControllerSettingsComponent('nesControls');

export default function NESSettings() {
    return (
        <Fragment>
            <SettingsTitle title="Nintendo Entertainment System Controls" />
            <Component />
        </Fragment>
    );
}

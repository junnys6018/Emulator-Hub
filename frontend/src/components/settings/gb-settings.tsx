import React, { Fragment } from 'react';
import { SettingsControlGrid, SettingsTitle } from './common';

export default function GBSettings() {
    return (
        <Fragment>
            <SettingsTitle title="Game Boy Controls" />
            <SettingsControlGrid
                actions={['UP', 'DOWN', 'LEFT', 'RIGHT', 'A', 'B', 'START', 'SELECT']}
                defaultKeyboard={['UP ARROW', 'DOWN ARROW', 'LEFT ARROW', 'RIGHT ARROW', 'Z', 'X', 'Q', 'ENTER']}
                defaultController={['DPAD UP', ' DPAD DOWN', 'DPAD LEFT', 'DPAD RIGHT', 'A', 'B', 'START', 'SELECT']}
            />
        </Fragment>
    );
}

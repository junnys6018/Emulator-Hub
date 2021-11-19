import React, { Fragment } from 'react';
import Switch from '../util/switch';
import { SettingsTitle } from './common';

export default function GeneralSettings() {
    return (
        <Fragment>
            <SettingsTitle title="General" />
            <div className="flex items-center">
                <label htmlFor="show-hidden-games" className="mr-auto">
                    Show Hidden Games
                </label>
                <Switch id="show-hidden-games" name="show-hidden-games" />
            </div>
        </Fragment>
    );
}

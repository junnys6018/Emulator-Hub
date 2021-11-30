import React, { Fragment } from 'react';

import { GeneralSettings } from '@/src/storage/user-data';
import { installSettingCallbacks, SettingsComponentProps, SettingsTitle } from './common';
import Switch from '../util/switch';

function GeneralSettingsComponent(props: SettingsComponentProps<GeneralSettings>) {
    return (
        <Fragment>
            <SettingsTitle title="General" />
            <div className="flex items-center pb-48 lg:pb-0">
                <label htmlFor="show-hidden-games" className="mr-auto">
                    Show Hidden Games
                </label>
                <Switch
                    id="show-hidden-games"
                    name="show-hidden-games"
                    checked={props.currentSettings.showHiddenGames}
                    onChange={e => {
                        props.onChange('showHiddenGames', e.currentTarget.checked);
                    }}
                />
            </div>
            <div className="flex mt-auto mb-12 lg:mb-24">
                <button
                    className={`btn-primary h-10 w-40 lg:w-52 mr-auto lg:mr-20 ${
                        props.settingsChanged() ? '' : 'disabled'
                    }`}
                    onClick={props.onSave}
                >
                    Save
                </button>
                <button className="btn-secondary h-10 w-40 lg:w-52" onClick={props.resetAll}>
                    Reset All
                </button>
            </div>
        </Fragment>
    );
}

const GeneralSettingsPanel = installSettingCallbacks(
    GeneralSettingsComponent,
    'general',
    (key: keyof GeneralSettings, value: boolean, currentSettings: GeneralSettings) => {
        currentSettings[key] = value;
        return currentSettings;
    },
);

export default GeneralSettingsPanel;

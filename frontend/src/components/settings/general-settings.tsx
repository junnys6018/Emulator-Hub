import React, { Fragment } from 'react';

import { GeneralSettings } from '@/src/storage/user-data';
import { installSettingCallbacks, SettingsComponentProps, SettingsTitle } from './common';
import Switch from '../util/switch';

function GeneralSettingsComponent(props: SettingsComponentProps<GeneralSettings>) {
    return (
        <Fragment>
            <SettingsTitle title="General" />
            <div className="flex items-center pb-7 md:pb-12">
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
            <h2 className="font-medium text-2xl mb-5 md:mb-3">Danger Zone</h2>
            <div className="danger-zone-container">
                <h3 className="font-medium text-lg mb-3 md:mb-0">Delete This User</h3>
                <p className="mb-6 md:mb-0">Once you delete this user, there is no going back. Please be certain</p>
                <button className="font-medium text-lg btn-primary danger py-1.5 md:h-10 w-full">
                    Delete This User
                </button>
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

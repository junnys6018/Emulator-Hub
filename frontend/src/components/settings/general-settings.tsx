import React, { Fragment, useCallback, useEffect, useState } from 'react';
import _ from 'lodash';

import { defaultGeneralSettings, useUserProfile, GeneralSettings } from '@/src/storage/user-data';
import { SettingsTitle } from './common';
import Switch from '../util/switch';
import { useMessage } from '../util/message';
import { useAlert } from '../util/alert';

export default function GeneralSettingsPanel() {
    const [
        {
            settings: { general },
        },
        setUserData,
    ] = useUserProfile();

    const [currentSettings, setCurrentSettings] = useState(_.cloneDeep(general));

    useEffect(() => {
        setCurrentSettings(_.cloneDeep(general));
    }, [general]);

    const message = useMessage();
    const alert = useAlert();

    const settingsChanged = () => {
        return !_.isEqual(currentSettings, general);
    };

    const resetAll = () => {
        // Create a deep copy here, so that the defaults dont get modified
        setCurrentSettings(_.cloneDeep(defaultGeneralSettings));
    };

    const onChange = useCallback(
        (label: keyof GeneralSettings, key: boolean) => {
            currentSettings[label] = key;
            // Create a deep copy, to trigger a re-render
            setCurrentSettings(_.cloneDeep(currentSettings));
        },
        [currentSettings],
    );

    // TODO: repeat the `.then` logic in other setting pages
    const onSave = () => {
        if (settingsChanged()) {
            setUserData({ settings: { general: currentSettings } }).then(
                () => message('Settings saved', { title: 'Success', severity: 'SUCCESS' }),
                error => alert(`${error}`, { title: 'Error', severity: 'ERROR' }),
            );
        }
    };

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
                    checked={currentSettings.showHiddenGames}
                    onChange={e => {
                        onChange('showHiddenGames', e.currentTarget.checked);
                    }}
                />
            </div>
            <div className="flex mt-auto mb-12 lg:mb-24">
                <button
                    className={`btn-primary h-10 w-40 lg:w-52 mr-auto lg:mr-20 ${settingsChanged() ? '' : 'disabled'}`}
                    onClick={onSave}
                >
                    Save
                </button>
                <button className="btn-secondary h-10 w-40 lg:w-52" onClick={resetAll}>
                    Reset All
                </button>
            </div>
        </Fragment>
    );
}

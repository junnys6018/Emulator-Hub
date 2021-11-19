import { defaultGamepadSettings, useUserProfile, GamepadSettings } from '@/src/storage/user-data';
import React, { Fragment } from 'react';
import { SettingsControlGrid, SettingsTitle } from './common';

export default function GBSettings() {
    const [{ settings }, setUserData] = useUserProfile();

    const onChange = (action: string, key: string | number | null) => {
        if (action.endsWith('keyboard')) {
            action = action.replace(/-keyboard$/, '');
            if (key === null) {
                key = defaultGamepadSettings[action as keyof typeof defaultGamepadSettings][0];
            }
            settings.gbSettings[action as keyof GamepadSettings][0] = key as string;
            setUserData({ settings });
        }
    };

    const resetAll = () => {
        // Create a deep clone here
        settings.gbSettings = JSON.parse(JSON.stringify(defaultGamepadSettings));
        setUserData({ settings });
    };

    return (
        <Fragment>
            <SettingsTitle title="Game Boy Controls" />
            <SettingsControlGrid
                controls={
                    settings.gbSettings as unknown as {
                        [action: string]: [string, number];
                    }
                }
                onChange={onChange}
            />
            <button className="btn-secondary mt-auto mb-24 h-10 px-16 w-max" onClick={resetAll}>
                Reset All
            </button>
        </Fragment>
    );
}

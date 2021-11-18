import { useUserProfile } from '@/src/storage/user-data';
import React, { Fragment } from 'react';
import { SettingsControlGrid, SettingsTitle } from './common';

export default function GBSettings() {
    const [
        {
            settings: { gbSettings },
        },
    ] = useUserProfile();

    return (
        <Fragment>
            <SettingsTitle title="Game Boy Controls" />
            <SettingsControlGrid
                controls={
                    gbSettings as unknown as {
                        [action: string]: [string, number];
                    }
                }
            />
        </Fragment>
    );
}

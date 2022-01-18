import React, { Fragment, useState } from 'react';

import { deleteUser, GeneralSettings, useActiveUserProfile } from '@/src/storage/user-data';
import { installSettingCallbacks, SettingsComponentProps, SettingsTitle } from './common';
import Switch from '../util/switch';
import { Alert } from '../util/alert';
import { FaTimes } from 'react-icons/fa';
import { useDatabase } from '@/src/storage/storage';

function GeneralSettingsComponent(props: SettingsComponentProps<GeneralSettings>) {
    const [confirmDeleteField, setConfirmDeleteField] = useState('');
    const [showUserDeleteModal, setShowUserDeleteModal] = useState(false);

    const [{ userName, uuid }] = useActiveUserProfile();
    const db = useDatabase();

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
                <button
                    className="font-medium text-lg btn-primary danger py-1.5 md:h-10 w-full"
                    onClick={() => setShowUserDeleteModal(true)}
                >
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
            {showUserDeleteModal && (
                <Alert
                    onClose={() => {
                        setShowUserDeleteModal(false);
                        setConfirmDeleteField('');
                    }}
                >
                    {close => (
                        <div className="user-delete-modal">
                            <div className="flex flex-row items-center mb-8">
                                <h3 className="font-semibold text-lg md:text-2xl mr-auto">Are You Absolutely Sure?</h3>
                                <button
                                    className="text-gray-300 md:hover:text-gray-50 active:text-gray-50"
                                    onClick={close}
                                >
                                    <FaTimes size="1.5rem" />
                                </button>
                            </div>
                            <p className="mb-8">
                                This action cannot be undone. This will permanently delete your user account. This
                                includes your roms and saves.
                            </p>
                            <p className="mb-3">
                                Please type <strong>{userName}</strong> to confirm.
                            </p>
                            <form
                                onSubmit={e => {
                                    e.preventDefault();

                                    if (confirmDeleteField === userName) {
                                        deleteUser(db, uuid).then(() => window.location.reload());
                                    }
                                }}
                            >
                                <input
                                    id="confirm-delete-field"
                                    name="confirm-delete-field"
                                    type="text"
                                    value={confirmDeleteField}
                                    onChange={e => setConfirmDeleteField(e.currentTarget.value)}
                                    className="appearance-none w-full text-lg bg-gray-900 rounded-lg h-9 px-3 focus:outline-none mb-3"
                                ></input>
                                <button
                                    className="btn-primary danger text-lg w-full py-1.5 px-4"
                                    style={
                                        confirmDeleteField !== userName
                                            ? { backgroundColor: '#64211E', cursor: 'not-allowed' }
                                            : undefined
                                    }
                                >
                                    I understand, delete this user
                                </button>
                            </form>
                        </div>
                    )}
                </Alert>
            )}
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

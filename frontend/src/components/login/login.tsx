import { defaultSettings, generateProfilePicture, UserData, useUserProfile } from '@/src/storage/user-data';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import ProfileIcon from './profile-icon';
import AddProfile from './add-profile';
import EditUserProfileForm from './edit-user-profile-form';
import { v4 as uuidv4 } from 'uuid';

import './login.css';
import EditingProfileIcon from './editing-profile-icon';
import getActiveUserUuid from '@/src/storage/get-active-user';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

interface LoginTemplateProps {
    children: React.ReactNode;
}

function LoginTemplate(props: LoginTemplateProps) {
    return (
        <Fragment>
            <h2 className="font-bold text-2xl xs:text-3xl mt-10 ml-16">Emulator Hub</h2>
            <div className="my-auto py-10 flex flex-col items-center">
                <h1 className="font-medium text-3xl sm:text-4xl md:text-6xl mb-16">Who&apos;s Playing?</h1>
                {props.children}
            </div>
        </Fragment>
    );
}

interface EditingLoginProps {
    done: () => void;
}

const whiteImage =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAADUExURf///6fEG8gAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAfSURBVGje7cExAQAAAMKg9U9tCF8gAAAAAAAAAIBLDSCAAAEf1udwAAAAAElFTkSuQmCC';

function EditingLogin(props: EditingLoginProps) {
    const [userProfiles, putUserData] = useUserProfile();
    const [editingUuid, setEditingUuid] = useState<string | null | 'NEW_USER'>(null);

    const editNameInput = useRef<HTMLInputElement>(null);
    const [userName, setUserName] = useState('');

    const [newProfileUrl, setNewProfileUrl] = useState<string>(whiteImage);
    const newProfileBlob = useRef<Blob | null>(null);

    const onSubmit = useCallback(() => {
        const sanitizedName = userName.trim();

        if (sanitizedName === '') {
            return;
        }

        if (editingUuid === 'NEW_USER') {
            if (newProfileBlob.current === null) {
                return;
            }

            const newUser: UserData = {
                profileImage: newProfileBlob.current,
                settings: _.cloneDeep(defaultSettings),
                userName: sanitizedName,
                uuid: uuidv4(),
            };

            URL.revokeObjectURL(newProfileUrl);

            putUserData(newUser).then(() => setEditingUuid(null));
        } else if (editingUuid !== null) {
            putUserData({ userName: sanitizedName, uuid: editingUuid }).then(() => setEditingUuid(null));
        }
    }, [editingUuid, newProfileUrl, putUserData, userName]);

    // Whenever editingUuid becomes non null we want to focus on the input element
    useEffect(() => {
        if (editingUuid !== null) {
            editNameInput.current?.focus();
        }
    }, [editingUuid]);

    return (
        <LoginTemplate>
            <div className="user-profile-container">
                {userProfiles.map(user => {
                    if (user.uuid === editingUuid) {
                        return (
                            <EditUserProfileForm
                                key={user.uuid}
                                profileImage={user.profileImage}
                                onSubmit={onSubmit}
                                inputRef={editNameInput}
                                userName={userName}
                                setUserName={setUserName}
                            />
                        );
                    } else {
                        return (
                            <EditingProfileIcon
                                key={user.uuid}
                                onClick={() => {
                                    if (editingUuid === null) {
                                        setEditingUuid(user.uuid);
                                        setUserName(user.userName);
                                    }
                                }}
                                userName={user.userName}
                                profileImage={user.profileImage}
                            />
                        );
                    }
                })}
                {editingUuid !== 'NEW_USER' && (
                    <AddProfile
                        onClick={() => {
                            if (editingUuid === null) {
                                generateProfilePicture().then(blob => {
                                    newProfileBlob.current = blob;
                                    const url = URL.createObjectURL(blob);

                                    setNewProfileUrl(url);
                                    setEditingUuid('NEW_USER');
                                    setUserName('New User');
                                });
                            }
                        }}
                    />
                )}
                {editingUuid === 'NEW_USER' && (
                    <EditUserProfileForm
                        profileImage={newProfileUrl}
                        onSubmit={onSubmit}
                        inputRef={editNameInput}
                        userName={userName}
                        setUserName={setUserName}
                    />
                )}
            </div>
            {editingUuid === null ? (
                <button className="btn-secondary muted text-xl py-3.5 px-11" onClick={props.done}>
                    Done
                </button>
            ) : (
                <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
                    <button onClick={onSubmit} className="btn-secondary success text-xl py-3.5 w-40">
                        Save
                    </button>
                    <button onClick={() => setEditingUuid(null)} className="btn-secondary danger text-xl py-3.5 w-40">
                        Cancel
                    </button>
                </div>
            )}
        </LoginTemplate>
    );
}

function LoginEmptyState() {
    const editNameInput = useRef<HTMLInputElement>(null);
    const [userName, setUserName] = useState('New User');
    const [addProfileClicked, setAddProfileClicked] = useState(false);

    const [newProfileUrl, setNewProfileUrl] = useState<string>(whiteImage);
    const newProfileBlob = useRef<Blob | null>(null);
    const [, putUserData] = useUserProfile();

    const onSubmit = useCallback(() => {
        const sanitizedName = userName.trim();

        if (sanitizedName === '') {
            return;
        }

        if (newProfileBlob.current === null) {
            return;
        }

        const newUser: UserData = {
            profileImage: newProfileBlob.current,
            settings: _.cloneDeep(defaultSettings),
            userName: sanitizedName,
            uuid: uuidv4(),
        };

        URL.revokeObjectURL(newProfileUrl);

        putUserData(newUser);
    }, [newProfileUrl, putUserData, userName]);

    // Whenever editingUuid becomes non null we want to focus on the input element
    useEffect(() => {
        if (addProfileClicked) {
            editNameInput.current?.focus();
        }
    }, [addProfileClicked]);

    return (
        <LoginTemplate>
            <div className={`user-profile-container ${!addProfileClicked && 'pb-14'}`}>
                {!addProfileClicked && (
                    <AddProfile
                        onClick={() => {
                            generateProfilePicture().then(blob => {
                                newProfileBlob.current = blob;
                                const url = URL.createObjectURL(blob);

                                setNewProfileUrl(url);
                                setAddProfileClicked(true);
                            });
                        }}
                    />
                )}
                {addProfileClicked && (
                    <EditUserProfileForm
                        profileImage={newProfileUrl}
                        onSubmit={onSubmit}
                        inputRef={editNameInput}
                        userName={userName}
                        setUserName={setUserName}
                    />
                )}
            </div>
            {addProfileClicked && (
                <button onClick={onSubmit} className="btn-secondary text-xl py-3.5 w-40">
                    Save
                </button>
            )}
        </LoginTemplate>
    );
}

export default function Login() {
    const [editing, setEditing] = useState(false);

    const toggleEdit = useCallback(() => {
        setEditing(editing => !editing);
    }, []);

    const [userProfiles] = useUserProfile();

    const activeUuid = getActiveUserUuid();

    if (activeUuid !== null) {
        return <Redirect to="/" />;
    }

    if (editing) {
        return <EditingLogin done={toggleEdit} />;
    } else if (userProfiles.length === 0) {
        return <LoginEmptyState />;
    }

    return (
        <LoginTemplate>
            <div className="user-profile-container">
                {userProfiles.map(user => (
                    <ProfileIcon
                        key={user.uuid}
                        uuid={user.uuid}
                        userName={user.userName}
                        profileImage={user.profileImage}
                    />
                ))}
            </div>
            <button className="btn-secondary muted text-xl py-3.5 px-11" onClick={toggleEdit}>
                Manage Profiles
            </button>
        </LoginTemplate>
    );
}

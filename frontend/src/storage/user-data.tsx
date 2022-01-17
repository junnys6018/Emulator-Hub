import { Record } from './storage';
import { v4 as uuidv4 } from 'uuid';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDatabase } from './storage';
import _ from 'lodash';
import getActiveUserUuid from './get-active-user';

// strings corresponding to KeyboardEvent.code, and an index into Gamepad.buttons
export interface GamepadControls {
    up: [string, number];
    down: [string, number];
    left: [string, number];
    right: [string, number];
    a: [string, number];
    b: [string, number];
    start: [string, number];
    select: [string, number];
}

export interface GeneralSettings {
    showHiddenGames: boolean;
}

export interface Settings {
    general: GeneralSettings;
    nesControls: GamepadControls;
    gbControls: GamepadControls;
    gbcControls: GamepadControls;
    chip8Controls: string[];
}

export interface UserDataView {
    profileImage: string;
    userName: string;
    settings: Settings;
    uuid: string;
}

export interface UserData extends Record {
    profileImage: Blob;
    userName: string;
    settings: Settings;
}

export const defaultGamepadControls: GamepadControls = Object.freeze({
    up: ['ArrowUp', 12] as [string, number],
    down: ['ArrowDown', 13] as [string, number],
    left: ['ArrowLeft', 14] as [string, number],
    right: ['ArrowRight', 15] as [string, number],
    a: ['KeyZ', 0] as [string, number],
    b: ['KeyX', 1] as [string, number],
    start: ['KeyQ', 9] as [string, number],
    select: ['Enter', 8] as [string, number],
});

export const defaultChip8Controls = [
    'KeyX',
    'Digit1',
    'Digit2',
    'Digit3',
    'KeyQ',
    'KeyW',
    'KeyE',
    'KeyA',
    'KeyS',
    'KeyD',
    'KeyZ',
    'KeyC',
    'Digit4',
    'KeyR',
    'KeyF',
    'KeyV',
];

export const defaultGeneralSettings: GeneralSettings = Object.freeze({
    showHiddenGames: false,
});

export const defaultSettings: Settings = Object.freeze({
    general: _.cloneDeep(defaultGeneralSettings),
    nesControls: _.cloneDeep(defaultGamepadControls),
    gbControls: _.cloneDeep(defaultGamepadControls),
    gbcControls: _.cloneDeep(defaultGamepadControls),
    chip8Controls: _.cloneDeep(defaultChip8Controls),
});

/**
 * Generate a random color gradient as the profile image
 */
export async function generateProfilePicture(): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;

    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('Failed to create canvas context');
    }

    const getRandomColor = () => {
        return `hsl(${Math.random() * 256}, 100%, 50%)`;
    };

    const gradient = context.createLinearGradient(0, 0, 128, 128);
    gradient.addColorStop(0, getRandomColor());
    gradient.addColorStop(1, getRandomColor());

    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);

    const profileImage = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Failed to serialize image to a blob'));
            }
        }, 'image/png');
    });

    return profileImage;
}

function sortUserData(u1: UserDataView, u2: UserDataView): number {
    const name1 = u1.userName.toLowerCase();
    const name2 = u2.userName.toLowerCase();

    if (name1 === name2) {
        return 0;
    } else if (name1 < name2) {
        return -1;
    }
    return 1;
}

const UserProfileContext = React.createContext<
    | [UserDataView[], (newUserData: RecursivePartial<UserData>) => Promise<void>]
    | null // Used to indicate user profiles are still loading
    | undefined // Default value, used to indicate context is being used without a provider
>(undefined);

export function UserProfileProvider(props: { children: React.ReactNode }) {
    const [userDataView, setUserDataView] = useState<UserDataView[] | null>(null);

    const db = useDatabase();

    useEffect(() => {
        db.getAll('users').then(users => {
            const userDataView: UserDataView[] = [];
            for (const user of users) {
                const profileImage = URL.createObjectURL(user.profileImage);
                userDataView.push({
                    profileImage,
                    userName: user.userName,
                    settings: _.cloneDeep(user.settings),
                    uuid: user.uuid,
                });
            }

            userDataView.sort(sortUserData);

            setUserDataView(userDataView);
        });
    }, [db]);

    /**
     * Puts a `UserData` record in the database
     *
     * If the record already exists, the new record is merged with the old one
     */
    const putUserData = useCallback(
        async (newUserData: RecursivePartial<UserData> & { uuid: string }): Promise<void> => {
            if (userDataView === null) {
                return;
            }

            const existingProfileImageUrl = userDataView.find(item => item.uuid === newUserData.uuid)?.profileImage;
            const overrideProfileImage =
                existingProfileImageUrl !== undefined && newUserData.profileImage !== undefined;

            if (overrideProfileImage) {
                URL.revokeObjectURL(existingProfileImageUrl);
            }

            const userData = await db.get('users', newUserData.uuid);
            const isNew = userData === undefined;

            if (!isNew) {
                // Merge with existing entry
                newUserData = _.merge(userData, newUserData);
            }

            // Create the new view
            const newUserDataView = {
                profileImage:
                    overrideProfileImage || isNew
                        ? URL.createObjectURL(newUserData.profileImage as Blob)
                        : existingProfileImageUrl,
                userName: newUserData.userName,
                settings: newUserData.settings,
                uuid: newUserData.uuid,
            } as UserDataView;

            setUserDataView(userDataView => {
                if (userDataView === null) {
                    return null;
                }

                if (isNew) {
                    return userDataView.concat(newUserDataView).sort(sortUserData);
                } else {
                    const uuid = newUserDataView.uuid;

                    // Update the existing view, its important that we update the item instead of replacing it
                    // because code might save a reference to the view, in which case it will be holding onto
                    // a 'stale' reference of the view.
                    const existingUserDataView = userDataView.find(item => item.uuid === uuid) as UserDataView;
                    _.merge(existingUserDataView, newUserDataView);

                    // Create new array to force re-render
                    return [...userDataView].sort(sortUserData);
                }
            });

            await db.put('users', newUserData as UserData);
        },
        [db, userDataView],
    );

    return (
        <UserProfileContext.Provider value={userDataView === null ? null : [userDataView, putUserData]}>
            {userDataView !== null && props.children}
        </UserProfileContext.Provider>
    );
}

export function useUserProfile() {
    const userProfile = useContext(UserProfileContext);
    if (userProfile === undefined) {
        throw new Error('useUserProfile() must be called with a UserProfileProvider');
    } else if (userProfile === null) {
        throw new Error('[BUG] useUserProfile() called before data is loaded');
    }
    return userProfile;
}

export function useActiveUserProfile(): [UserDataView, (newUserData: RecursivePartial<UserData>) => Promise<void>] {
    const [userDataView, putUserData] = useUserProfile();
    const activeUuid = getActiveUserUuid();

    if (activeUuid === null) {
        throw new Error('[BUG] useActiveUserProfile() called with no active user');
    }

    const activeUser = userDataView.find(item => item.uuid === activeUuid);

    if (activeUser === undefined) {
        throw new Error('[BUG] active user does not point to a valid user');
    }

    const putUserDataWrapper = useCallback(
        (newUserData: RecursivePartial<UserData>) => {
            newUserData.uuid = activeUuid;
            return putUserData(newUserData);
        },
        [activeUuid, putUserData],
    );

    return [activeUser, putUserDataWrapper];
}

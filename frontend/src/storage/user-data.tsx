import { Record } from './storage';
import { v4 as uuidv4 } from 'uuid';
import React, { useContext, useEffect, useState } from 'react';
import { useAlert } from '../components/util/alert';
import { useDatabase } from './storage';
import _ from 'lodash';

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

export interface UserProfile {
    profileImage: string;
    userName: string;
    settings: Settings;
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
 * Generate a new guest account with a random color gradient as the profile image
 *
 * May throw
 */
export async function generateGuestAccount(): Promise<UserData> {
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

    return {
        uuid: uuidv4(),
        age: 0,
        userName: 'Guest',
        profileImage: profileImage,
        settings: _.cloneDeep(defaultSettings),
    };
}

const whiteImage =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAADUExURf///6fEG8gAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAfSURBVGje7cExAQAAAMKg9U9tCF8gAAAAAAAAAIBLDSCAAAEf1udwAAAAAElFTkSuQmCC';

const UserProfileContext = React.createContext<
    [UserProfile, (newUserData: RecursivePartial<UserData>) => Promise<string>] | null
>(null);

export function UserProfileProvider(props: { children: React.ReactNode }) {
    const [userProfile, setUserProfile] = useState<UserProfile>({
        profileImage: whiteImage,
        userName: 'Loading...',
        settings: _.cloneDeep(defaultSettings),
    });

    const [userData, _setUserData] = useState<UserData>();
    const db = useDatabase();
    const alert = useAlert();

    useEffect(() => {
        const loadUserDataFromUuid = (uuid: string) => {
            db.get('users', uuid).then(userData => {
                if (userData) {
                    const url = URL.createObjectURL(userData.profileImage);
                    setUserProfile({
                        profileImage: url,
                        userName: userData.userName,
                        settings: userData.settings,
                    });
                    _setUserData(userData);
                } else {
                    localStorage.removeItem('guest-uuid');
                    alert(`UUID ${uuid} does not point to an account`, {
                        severity: 'ERROR',
                        action: 'REFRESH',
                    });
                }
            });
        };

        const guestUuid = localStorage.getItem('guest-uuid');
        if (guestUuid) {
            console.log('[INFO] found guestUuid, loading from storage');
            loadUserDataFromUuid(guestUuid);
        } else {
            alert('Guest UUID not found', {
                severity: 'ERROR',
                action: 'REFRESH',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setUserData = (newUserData: RecursivePartial<UserData>): Promise<string> => {
        if (userData) {
            console.log('[INFO] setting new user data');
            const updatedUserData = _.merge(userData, newUserData);
            // update UserProfile
            URL.revokeObjectURL(userProfile.profileImage);
            const url = URL.createObjectURL(updatedUserData.profileImage);
            setUserProfile({
                profileImage: url,
                userName: updatedUserData.userName,
                settings: updatedUserData.settings,
            });
            _setUserData(updatedUserData);
            // write to db
            return db.put('users', updatedUserData);
        }
        // User data has not been set yet in the effect hook
        return new Promise((_resolve, reject) =>
            reject(new Error('User data has not yet been loaded, please try again')),
        );
    };

    return (
        <UserProfileContext.Provider value={[userProfile, setUserData]}>{props.children}</UserProfileContext.Provider>
    );
}

export function useUserProfile() {
    const userProfile = useContext(UserProfileContext);
    if (!userProfile) {
        throw new Error('useUserProfile() must be called with a UserProfileProvider');
    }
    return userProfile;
}

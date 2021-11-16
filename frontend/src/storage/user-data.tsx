import { Record } from './storage';
import { v4 as uuidv4 } from 'uuid';
import React, { useContext, useEffect, useState } from 'react';
import { useAlert } from '../components/util/alert';
import { useDatabase } from './storage';

export interface UserData extends Record {
    profileImage: Blob;
    userName: string;
}

interface UserProfile {
    profileImage: string;
    userName: string;
}

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
    };
}

const whiteImage =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAADUExURf///6fEG8gAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAfSURBVGje7cExAQAAAMKg9U9tCF8gAAAAAAAAAIBLDSCAAAEf1udwAAAAAElFTkSuQmCC';

const UserProfileContext = React.createContext<[UserProfile, (newUserData: Partial<UserData>) => void] | null>(null);

export function UserProfileProvider(props: { children: React.ReactNode }) {
    const [userProfile, setUserProfile] = useState<UserProfile>({
        profileImage: whiteImage,
        userName: 'Loading...',
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
    }, []);

    const setUserData = (newUserData: Partial<UserData>) => {
        if (userData) {
            console.log('[INFO] setting new user data');
            const updatedUserData = { ...userData, ...newUserData };
            // update UserProfile
            URL.revokeObjectURL(userProfile.profileImage);
            const url = URL.createObjectURL(updatedUserData.profileImage);
            setUserProfile({
                profileImage: url,
                userName: updatedUserData.userName,
            });
            _setUserData(updatedUserData);
            // write to db
            db.put('users', updatedUserData);
        }
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

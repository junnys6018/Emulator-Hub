import { Record, EmulatorHubDB } from './storage';
import { v4 as uuidv4 } from 'uuid';
import React, { useContext, useEffect, useState } from 'react';
import { openDB } from 'idb';

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

const UserProfileContext = React.createContext<UserProfile>({
    profileImage: whiteImage,
    userName: 'Loading...',
});

export function UserProfileProvider(props: { children: React.ReactNode }) {
    const [userProfile, setUserProfile] = useState<UserProfile>({
        profileImage: whiteImage,
        userName: 'Loading...',
    });

    useEffect(() => {
        let url = '';
        const guestUuid = localStorage.getItem('guest-uuid');

        const loadUserDataFromUuid = (uuid: string) => {
            openDB<EmulatorHubDB>('emulator-hub', 1)
                .then(db => db.get('users', uuid))
                .then(userData => {
                    if (userData) {
                        url = URL.createObjectURL(userData.profileImage);
                        setUserProfile({
                            profileImage: url,
                            userName: userData.userName,
                        });
                    } else {
                        // TODO
                        alert(`[FATAL] uuid ${uuid} does not point to an account`);
                    }
                });
        };

        if (guestUuid) {
            console.log('[INFO] found guestUuid, loading from storage');
            loadUserDataFromUuid(guestUuid);
        } else {
            console.log('[INFO] guestUuid not found, adding event listener...');
            window.addEventListener('storage', function callback(e) {
                if (e.key === 'guest-uuid' && e.newValue !== null) {
                    console.log('[INFO] guestUuid found, removing event listener...');
                    loadUserDataFromUuid(e.newValue);
                    window.removeEventListener('storage', callback);
                }
            });
        }

        return () => {
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    }, []);

    return <UserProfileContext.Provider value={userProfile}>{props.children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
    return useContext(UserProfileContext);
}

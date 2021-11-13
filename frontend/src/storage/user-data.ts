import { Record } from './storage';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';

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
export function useUserProfile() {
    const [userProfile, setUserProfile] = useState<UserProfile>({
        profileImage: whiteImage,
        userName: 'Loading...',
    });

    useEffect(() => {
        // setup
        let url = '';
        generateGuestAccount()
            .then(userData => {
                url = URL.createObjectURL(userData.profileImage);
                setUserProfile({
                    profileImage: url,
                    userName: userData.userName,
                });
            })
            .catch(error => {
                alert(error);
            });

        // cleanup
        return () => {
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    }, []);

    return userProfile;
}

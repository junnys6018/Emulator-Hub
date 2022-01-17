import React from 'react';
import { FaPen } from 'react-icons/fa';

interface EditingProfileIconProps {
    profileImage: string;
    userName: string;
    onClick: () => void;
}

export default function EditingProfileIcon(props: EditingProfileIconProps) {
    return (
        <button className="profile-icon" onClick={props.onClick}>
            <div
                className="profile-icon__image bg-cover bg-center bg-blend-multiply rounded-full flex items-center justify-center w-full"
                style={{
                    aspectRatio: '1',
                    backgroundImage: `url(${props.profileImage})`,
                    backgroundColor: 'rgb(128, 128, 128)',
                }}
            >
                <FaPen size="1.5rem" />
            </div>
            <span className="block truncate w-full font-medium text-2xl mt-3">{props.userName}</span>
        </button>
    );
}

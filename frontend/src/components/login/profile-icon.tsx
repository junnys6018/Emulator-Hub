import React, { useCallback } from 'react';

interface ProfileIconProps {
    profileImage: string;
    userName: string;
    uuid: string;
}

export default function ProfileIcon(props: ProfileIconProps) {
    const onClick = useCallback(() => {
        localStorage.setItem('active-uuid', props.uuid);
        window.location.reload();
    }, [props.uuid]);

    return (
        <button className="profile-icon" onClick={onClick}>
            <img
                className="profile-icon__image object-cover object-center rounded-full w-full"
                style={{ aspectRatio: '1' }}
                src={props.profileImage}
            ></img>
            <span className="block truncate w-full font-medium text-2xl mt-3">{props.userName}</span>
        </button>
    );
}

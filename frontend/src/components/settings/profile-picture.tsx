import classNames from 'classnames';
import React from 'react';
import { FaPen } from 'react-icons/fa';

interface ProfilePictureProps {
    size: string;
    profileImage: string;
    className?: string;
    onEdit?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SCALE_FACTOR = 1.70710678119; // 1 + 1 / sqrt(2)

export default function ProfilePicture(props: ProfilePictureProps) {
    const buttonSize = 32;
    const radius = parseInt(props.size, 10) / 2;
    const offset = SCALE_FACTOR * radius - buttonSize / 2;
    const buttonTransform: React.CSSProperties = {
        transform: `translate(${offset}px, ${offset}px)`,
    };

    return (
        <div className={classNames('relative', props.className)}>
            <img
                src={props.profileImage}
                className="rounded-full filter drop-shadow object-cover"
                style={{ width: props.size, height: props.size }}
            ></img>
            <label
                htmlFor="change-profile-image"
                className="
                    absolute top-0 left-0 w-8 h-8 rounded-full bg-gray-800 filter drop-shadow cursor-pointer
                    flex items-center justify-center active:text-green-500 md:hover:text-green-500
                "
                style={buttonTransform}
            >
                <input
                    className="hidden"
                    type="file"
                    id="change-profile-image"
                    name="change-profile-image"
                    accept="image/png, image/jpeg"
                    onChange={props.onEdit}
                />
                <FaPen />
            </label>
        </div>
    );
}

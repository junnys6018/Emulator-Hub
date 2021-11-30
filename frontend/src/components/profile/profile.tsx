import React from 'react';
import { FaAngleDown } from 'react-icons/fa';
import classNames from 'classnames';

import ProfilePopup from './profile-popup';
import './profile.css';

interface ProfileProps {
    profileImage: string;
    userName: string;
    className: string;
}

export default function Profile(props: ProfileProps) {
    return (
        <div className={classNames('relative dropdown-container', props.className)}>
            <button className="select-none h-10 pr-5 rounded-full bg-gray-700 hover:text-green-500">
                <img
                    className="inline-block rounded-full mr-2 w-10 h-10 object-cover object-center"
                    src={props.profileImage}
                ></img>
                <span className="text-xl align-middle mr-1.5">{props.userName}</span>
                <FaAngleDown className="inline-block" />
            </button>
            <ProfilePopup profileImage={props.profileImage} />
        </div>
    );
}

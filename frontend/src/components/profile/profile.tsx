import React from 'react';
import { FaAngleDown } from 'react-icons/fa';
import classNames from 'classnames';

import ProfileDropdown from './profile-dropdown';
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
                    className="inline-block rounded-full mr-2"
                    width="40px"
                    height="40px"
                    src={props.profileImage}
                ></img>
                <span className="text-xl align-middle mr-1.5">{props.userName}</span>
                <FaAngleDown className="inline-block" />
            </button>
            <ProfileDropdown profileImage={props.profileImage} />
        </div>
    );
}

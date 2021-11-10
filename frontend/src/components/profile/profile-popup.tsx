import React from 'react';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function ProfilePopup(props: { profileImage: string }) {
    return (
        <div
            className="
                pointer-events-none opacity-0 absolute w-max -right-1 transform translate-y-6 z-10
                filter drop-shadow bg-gray-700 transition-opacity duration-75 rounded-2xl cursor-default
                flex flex-col items-stretch dropdown
            "
            tabIndex={1}
        >
            <img
                className="rounded-full filter drop-shadow my-3 mx-11"
                width="120px"
                height="120px"
                src={props.profileImage}
            ></img>
            <div className="border-t border-gray-600"></div>
            <Link to="#" className="w-max ml-11 my-3 text-left hover:text-green-500">
                <FaCog className="inline-block mr-4" size="" />
                Settings
            </Link>
            <Link to="#" className="w-max ml-11 mb-3 text-left hover:text-green-500">
                <FaSignOutAlt className="inline-block mr-4" />
                Sign Out
            </Link>
        </div>
    );
}

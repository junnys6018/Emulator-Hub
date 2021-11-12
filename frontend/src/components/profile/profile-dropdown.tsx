import React from 'react';
import { FaCog, FaPlus, FaSignOutAlt, FaTable } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface ProfileDropdownProps {
    profileImage: string;
    userName: string;
    children?: React.ReactNode;
}

export default function ProfileDropdown(props: ProfileDropdownProps) {
    return (
        <div className="container flex flex-col">
            <div className="flex my-6 items-center">
                <img className="rounded-full" src={props.profileImage} width="100px" height="100px"></img>
                <span className="mx-auto text-4xl font-semibold">{props.userName}</span>
            </div>

            {props.children}
            <Link to="/dashboard" className="text-lg w-max active:text-green-500 mb-4">
                <FaTable className="inline-block mr-4" />
                Dashboard
            </Link>
            <Link to="#" className="text-lg w-max active:text-green-500 mb-4">
                <FaCog className="inline-block mr-4" />
                Settings
            </Link>
            <Link to="#" className="text-lg w-max active:text-green-500 mb-4">
                <FaSignOutAlt className="inline-block mr-4" />
                Sign Out
            </Link>
            {/* FIXME: Bottom margin does not show on firefox mobile */}
            <Link to="/add-roms" className="text-lg  tracking-wider w-max active:text-green-500 mb-6">
                <FaPlus className="inline-block mr-4" />
                ADD ROMS
            </Link>
        </div>
    );
}

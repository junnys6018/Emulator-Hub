import React, { useCallback } from 'react';
import { FaCog, FaPlus, FaSignOutAlt, FaTable } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface ProfileDropdownProps {
    profileImage: string;
    userName: string;
    children?: React.ReactNode;
}

export default function ProfileDropdown(props: ProfileDropdownProps) {
    const signOut = useCallback(() => {
        localStorage.removeItem('active-uuid');
        window.location.reload();
    }, []);

    return (
        <div className="container flex flex-col">
            <div className="flex my-6 items-center">
                <img
                    className="rounded-full object-cover object-center"
                    src={props.profileImage}
                    style={{ width: '100px', height: '100px' }}
                ></img>
                <span className="truncate mx-auto pl-3 text-4xl font-semibold">{props.userName}</span>
            </div>

            {props.children}
            <Link to="/dashboard" className="text-lg w-max active:text-green-500 mb-4">
                <FaTable className="inline-block mr-4" />
                Dashboard
            </Link>
            <Link to="/settings" className="text-lg w-max active:text-green-500 mb-4">
                <FaCog className="inline-block mr-4" />
                Settings
            </Link>
            <button onClick={signOut} className="text-lg w-max active:text-green-500 mb-4">
                <FaSignOutAlt className="inline-block mr-4" />
                Sign Out
            </button>
            <Link to="/add-roms" className="text-lg  tracking-wider w-max active:text-green-500 mb-6">
                <FaPlus className="inline-block mr-4" />
                ADD ROMS
            </Link>
        </div>
    );
}

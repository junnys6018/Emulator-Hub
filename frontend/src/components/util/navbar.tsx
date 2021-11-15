import React, { useState } from 'react';
import ProfileDropdown from '../profile/profile-dropdown';
import Profile from '../profile/profile';
import { Link } from 'react-router-dom';

interface NavbarProps {
    profileImage: string;
    userName: string;
}

export default function Navbar(props: NavbarProps) {
    const [dropdownActive, setDropDownActive] = useState(false);

    return (
        <div className="flex flex-wrap">
            <div className="container my-7 md:my-10 flex items-center">
                <Link to="/dashboard" className="md:hidden font-bold text-2xl xs:text-3xl mr-auto">
                    Emulator Hub
                </Link>
                <Link
                    to="/dashboard"
                    className="hidden md:inline-block font-medium text-xl text-primary-500 hover:underline mr-auto"
                >
                    Dashboard
                </Link>
                <Profile className="hidden md:block" {...props} />
                <button className="select-none md:hidden" onClick={() => setDropDownActive(!dropdownActive)}>
                    <img className="rounded-full w-10 h-10" src={props.profileImage}></img>
                </button>
            </div>
            {/* Profile Dropdown */}
            <div
                className={`md:hidden flex-grow w-full bg-gray-900 overflow-hidden transition-max-height ${
                    dropdownActive ? 'nav__dropdown-container-height' : 'max-h-0'
                }`}
            >
                <ProfileDropdown profileImage={props.profileImage} userName={props.userName} />
            </div>
        </div>
    );
}

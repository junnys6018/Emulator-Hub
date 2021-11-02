import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCog, FaPlus, FaSearch, FaSignOutAlt } from 'react-icons/fa';

import Profile from '../profile/profile';
import './navbar.css';

interface NavbarProps {
    profileImage: string;
    userName: string;
}

export default function Navbar(props: NavbarProps) {
    const [dropdownActive, setDropDownActive] = useState(false);

    return (
        <div className="flex flex-wrap">
            <div className="container my-7 md:my-10 flex items-center">
                <span className="font-bold text-2xl xs:text-3xl mr-auto xl:mr-20">Emulator Hub</span>
                <a href="#nintendo-entertainment-system" className="nav__nav-item">
                    NES
                </a>
                <a href="#game-boy" className="nav__nav-item">
                    GB
                </a>
                <a href="#game-boy-color" className="nav__nav-item">
                    GBC
                </a>
                <a href="#chip-8" className="nav__nav-item mr-auto">
                    CHIP 8
                </a>
                <Link to="#" className="hidden md:flex btn-secondary tracking-wider h-10 px-4 mr-10">
                    <FaPlus className="inline-block mr-2.5" size="12px" />
                    ADD ROMS
                </Link>
                <FaSearch className="md:hidden mr-5 hover:text-green-500 hover:cursor-pointer" size="24px" />
                <Profile className="hidden md:block" profileImage={props.profileImage} userName={props.userName} />
                <button className="select-none md:hidden" onClick={() => setDropDownActive(!dropdownActive)}>
                    <img className="rounded-full" src={props.profileImage} width="40px" height="40px"></img>
                </button>
            </div>
            <div
                className={`md:hidden flex-grow bg-gray-900 overflow-hidden transition-max-height ${
                    dropdownActive ? 'nav__dropdown-container-height' : 'max-h-0'
                }`}
            >
                <div className="container flex flex-col">
                    <div className="flex my-6 items-center">
                        <img className="rounded-full" src={props.profileImage} width="100px" height="100px"></img>
                        <span className="mx-auto text-4xl font-semibold">{props.userName}</span>
                    </div>
                    <span className="text-gray-300 mb-3">Jump To</span>
                    <a href="#nintendo-entertainment-system" className="nav__dropdown-item mb-3">
                        NES
                    </a>
                    <a href="#game-boy" className="nav__dropdown-item mb-3">
                        GB
                    </a>
                    <a href="#game-boy-color" className="nav__dropdown-item mb-3">
                        GBC
                    </a>
                    <a href="#chip-8" className="nav__dropdown-item mb-8">
                        CHIP 8
                    </a>

                    <Link to="#" className="text-lg w-max hover:text-green-500 mb-5">
                        <FaCog className="inline-block mr-4" size="" />
                        Settings
                    </Link>
                    <Link to="#" className="text-lg w-max hover:text-green-500 mb-5">
                        <FaSignOutAlt className="inline-block mr-4" />
                        Sign Out
                    </Link>
                    <Link to="#" className="text-lg  tracking-wider w-max hover:text-green-500 mb-6">
                        <FaPlus className="inline-block mr-4" />
                        ADD ROMS
                    </Link>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useRef } from 'react';
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

    const dropdownElement: React.MutableRefObject<null | HTMLDivElement> = useRef(null);

    const onJumpToClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        // Close the dropdown menu
        setDropDownActive(false);

        // The height of the dropdown is included in the scroll offset calculation made by the browser.
        // This is because we set the height to be transitioned, so its not instantly set to zero.
        // As such, we have to manually calculate the height of the dropdown and subtract it from the y position
        // of the target element.
        const id = e.currentTarget.href.split('#').at(-1) as string;
        const target = document.getElementById(id) as HTMLElement;
        const { y } = target.getBoundingClientRect();
        const dropdown = dropdownElement.current as HTMLDivElement;
        window.scroll(0, y - dropdown.clientHeight);
    };

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
                <Profile className="hidden md:block" {...props} />
                <FaSearch className="md:hidden mr-5 hover:text-green-500 hover:cursor-pointer" size="24px" />
                <button className="select-none md:hidden" onClick={() => setDropDownActive(!dropdownActive)}>
                    <img className="rounded-full" src={props.profileImage} width="40px" height="40px"></img>
                </button>
            </div>
            {/* Profile Dropdown */}
            <div
                ref={dropdownElement}
                className={`md:hidden flex-grow w-full bg-gray-900 overflow-hidden transition-max-height ${
                    dropdownActive ? 'nav__dropdown-container-height' : 'max-h-0'
                }`}
            >
                <div className="container flex flex-col">
                    <div className="flex my-6 items-center">
                        <img className="rounded-full" src={props.profileImage} width="100px" height="100px"></img>
                        <span className="mx-auto text-4xl font-semibold">{props.userName}</span>
                    </div>
                    <span className="text-gray-300 mb-3">Jump To</span>
                    <a onClick={onJumpToClick} href="#nintendo-entertainment-system" className="nav__dropdown-item mb-3">
                        NES
                    </a>
                    <a onClick={onJumpToClick} href="#game-boy" className="nav__dropdown-item mb-3">
                        GB
                    </a>
                    <a onClick={onJumpToClick} href="#game-boy-color" className="nav__dropdown-item mb-3">
                        GBC
                    </a>
                    <a onClick={onJumpToClick} href="#chip-8" className="nav__dropdown-item mb-8">
                        CHIP 8
                    </a>

                    <Link to="#" className="text-lg w-max active:text-green-500 mb-4">
                        <FaCog className="inline-block mr-4" size="" />
                        Settings
                    </Link>
                    <Link to="#" className="text-lg w-max active:text-green-500 mb-4">
                        <FaSignOutAlt className="inline-block mr-4" />
                        Sign Out
                    </Link>
                    <Link to="#" className="text-lg  tracking-wider w-max active:text-green-500 mb-6">
                        <FaPlus className="inline-block mr-4" />
                        ADD ROMS
                    </Link>
                </div>
            </div>
        </div>
    );
}

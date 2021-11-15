import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaArrowLeft } from 'react-icons/fa';

import Profile from '../profile/profile';
import './navbar.css';
import ProfileDropdown from '../profile/profile-dropdown';

interface NavbarProps {
    profileImage: string;
    userName: string;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function Navbar(props: NavbarProps) {
    const [dropdownActive, setDropDownActive] = useState(false);
    const [searchActive, setSearchActive] = useState(false);

    const dropdownElement: React.MutableRefObject<null | HTMLDivElement> = useRef(null);
    const searchInputElement: React.MutableRefObject<null | HTMLInputElement> = useRef(null);

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

    // FIXME: The active state is stolen by the search input, so the search button never goes green
    const onSearchButtonClick = () => {
        if (!searchActive) {
            searchInputElement.current?.focus();
        } else {
            props.setSearchQuery('');
        }
        setSearchActive(!searchActive);
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
                <Link to="/add-roms" className="hidden md:flex btn-secondary tracking-wider h-10 px-4 mr-10">
                    <FaPlus className="inline-block mr-2.5" size="12px" />
                    ADD ROMS
                </Link>
                <Profile className="hidden md:block" {...props} />
                <button className="md:hidden mr-5 active:text-green-500" onClick={onSearchButtonClick}>
                    <FaSearch size="24px" />
                </button>
                <button className="select-none md:hidden" onClick={() => setDropDownActive(!dropdownActive)}>
                    <img className="rounded-full w-10 h-10" src={props.profileImage}></img>
                </button>
            </div>
            {/* Profile Dropdown */}
            <div
                ref={dropdownElement}
                className={`md:hidden flex-grow w-full bg-gray-900 overflow-hidden transition-max-height ${
                    dropdownActive ? 'nav__dropdown-container-height' : 'max-h-0'
                }`}
            >
                <ProfileDropdown profileImage={props.profileImage} userName={props.userName}>
                    <span className="text-gray-300 mb-3">Jump To</span>
                    <a
                        onClick={onJumpToClick}
                        href="#nintendo-entertainment-system"
                        className="nav__dropdown-item mb-3"
                    >
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
                </ProfileDropdown>
            </div>
            {/* Search Dropdown */}
            <div
                className={`md:hidden flex-grow w-full bg-gray-900 overflow-hidden transition-max-height ${
                    searchActive ? 'nav__search-container-height' : 'max-h-0'
                }`}
            >
                <div className="container py-5 flex items-center">
                    <button
                        className="mr-5 active:text-green-500"
                        onClick={() => {
                            setSearchActive(false);
                            props.setSearchQuery('');
                        }}
                    >
                        <FaArrowLeft size="16px" />
                    </button>
                    <input
                        // On mobile, for some reason the input overflows if the width is not set, so we set it to 4px here
                        // then let it grow to take up the available space with flex-grow.
                        className="appearance-none mr-5 w-1 flex-grow bg-gray-900 focus:outline-none"
                        name="search-roms"
                        id="search-roms"
                        type="text"
                        placeholder="Search Roms"
                        ref={searchInputElement}
                        value={props.searchQuery}
                        onChange={e => props.setSearchQuery(e.currentTarget.value)}
                    ></input>
                    <FaSearch size="16px" />
                </div>
            </div>
        </div>
    );
}

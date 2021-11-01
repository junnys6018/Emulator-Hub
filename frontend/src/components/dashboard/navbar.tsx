import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

import Profile from '../profile/profile';

interface NavbarProps {
    profileImage: string;
    userName: string;
}

export default function Navbar(props: NavbarProps) {
    return (
        <div className="my-10 flex items-center">
            <span className="font-bold text-3xl mr-20">Emulator Hub</span>
            <a className="text-primary-500 tracking-wider mr-14 hover:underline hover:cursor-pointer">NES</a>
            <a className="text-primary-500 tracking-wider mr-14 hover:underline hover:cursor-pointer">GB</a>
            <a className="text-primary-500 tracking-wider mr-14 hover:underline hover:cursor-pointer">GBC</a>
            <a className="text-primary-500 tracking-wider mr-auto hover:underline hover:cursor-pointer">CHIP 8</a>
            <Link to="#" className="btn-secondary tracking-wider h-10 px-4 mr-10">
                <FaPlus className="inline-block mr-2.5" size="12px" />
                ADD ROMS
            </Link>
            <Profile profileImage={props.profileImage} userName={props.userName} />
        </div>
    );
}

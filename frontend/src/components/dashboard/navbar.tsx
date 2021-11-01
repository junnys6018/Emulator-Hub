import React from 'react';
import Profile from '../profile/profile';

interface NavbarProps {
    profileImage: string;
    userName: string;
}

export default function Navbar(props: NavbarProps) {
    return (
        <div className="container my-10 flex items-center">
            <span className="font-bold text-3xl mr-20">Emulator Hub</span>
            <span className="text-primary-500 tracking-wider mr-14">NES</span>
            <span className="text-primary-500 tracking-wider mr-14">GB</span>
            <span className="text-primary-500 tracking-wider mr-14">GBC</span>
            <span className="text-primary-500 tracking-wider mr-auto">CHIP 8</span>
            <Profile profileImage={props.profileImage} userName={props.userName} />
        </div>
    );
}

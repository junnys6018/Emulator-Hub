import React, { Fragment, useState } from 'react';

import GameItem from './game-item';
import Navbar from './navbar';
import Library from './library';

import SMB from '@/public/assets/SMB.png';
import profile from '@/public/assets/test-profile.png';

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('');

    const NESnames = ['Super Mario Bros', 'Zelda', 'Donkey Kong', 'Mario Cart'];
    const GBnames = ['Pokemon'];
    const GBCnames = ['Super Mario World'];
    const CHIP8names = ['Tetris'];

    if (searchQuery !== '') {
        for (const names of [NESnames, GBnames, GBCnames, CHIP8names]) {
            const filteredNames = names.filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()));
            names.splice(0, names.length, ...filteredNames);
        }
    }

    return (
        <Fragment>
            <Navbar userName="Jun Lim" profileImage={profile} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="container">
                <Library console="Nintendo Entertainment System">
                    {NESnames.map(name => (
                        <GameItem key={name} image={SMB} name={name} />
                    ))}
                </Library>
                <Library console="Game Boy">
                    {GBnames.map(name => (
                        <GameItem key={name} image={SMB} name={name} />
                    ))}
                </Library>
                <Library console="Game Boy Color">
                    {GBCnames.map(name => (
                        <GameItem key={name} image={SMB} name={name} />
                    ))}
                </Library>
                <Library console="CHIP 8">
                    {CHIP8names.map(name => (
                        <GameItem key={name} image={SMB} name={name} />
                    ))}
                </Library>
            </div>
        </Fragment>
    );
}

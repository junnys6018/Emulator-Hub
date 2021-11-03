import React, { Fragment } from 'react';

import GameItem from './game-item';
import Navbar from './navbar';
import Library from './library';

import SMB from '@/public/assets/SMB.png';
import profile from '@/public/assets/test-profile.png';

export default function Dashboard() {
    return (
        <Fragment>
            <Navbar userName="Jun Lim" profileImage={profile} />
            <div className="container">
                <Library console="Nintendo Entertainment System">
                    <GameItem image={SMB} name="Super Mario Bros" />
                    <GameItem image={SMB} name="Super Mario Bros" />
                    <GameItem image={SMB} name="Super Mario Bros" />
                    <GameItem image={SMB} name="Super Mario Bros" />
                </Library>
                <Library console="Game Boy">
                    <GameItem image={SMB} name="Super Mario Bros" />
                </Library>
                <Library console="Game Boy Color">
                    <GameItem image={SMB} name="Super Mario Bros" />
                    <GameItem image={SMB} name="Super Mario Bros" />
                </Library>
                <Library console="CHIP 8">
                    <GameItem image={SMB} name="Super Mario Bros" />
                    <GameItem image={SMB} name="Super Mario Bros" />
                    <GameItem image={SMB} name="Super Mario Bros" />
                </Library>
            </div>
        </Fragment>
    );
}

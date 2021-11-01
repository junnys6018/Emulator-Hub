import React, { Fragment } from 'react';

import Card from './card';
import Navbar from './navbar';
import Library from './library';

import SMB from '@/public/assets/SMB.png';
import profile from '@/public/assets/test-profile.png';

export default function Dashboard() {
    return (
        <Fragment>
            <Navbar userName="Jun Lim" profileImage={profile} />
            <Library console="Nintendo Entertainment System">
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
            </Library>
            <Library console="Game Boy Color">
                <Card image={SMB} name="Super Mario Bros" />
            </Library>
            <Library console="Game Boy">
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
            </Library>
            <Library console="CHIP 8">
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
            </Library>
        </Fragment>
    );
}

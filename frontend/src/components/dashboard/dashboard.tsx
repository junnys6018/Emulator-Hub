import React from 'react';

import Card from './card';
import Navbar from './navbar';
import Footer from '../footer/footer';

import SMB from '@/public/assets/SMB.png';
import profile from '@/public/assets/test-profile.png';

export default function Dashboard() {
    return (
        <div>
            <Navbar userName="Jun Lim" profileImage={profile} />
            <div className="container grid gap-9 grid-cols-4 auto-rows-80">
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
                <Card image={SMB} name="Super Mario Bros" />
            </div>
            <Footer />
        </div>
    );
}

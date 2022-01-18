import { useActiveUserProfile } from '@/src/storage/user-data';
import React, { Fragment } from 'react';
import Footer from '../footer/footer';
import Navbar from './navbar';

interface WrapNavAndFooterProps {
    children: React.ReactNode;
}

export default function WrapNavAndFooter(props: WrapNavAndFooterProps) {
    const [{ userName, profileImage }] = useActiveUserProfile();

    return (
        <Fragment>
            <div className="flex-grow relative">
                <Navbar userName={userName} profileImage={profileImage} />
                {props.children}
            </div>
            <Footer />
        </Fragment>
    );
}

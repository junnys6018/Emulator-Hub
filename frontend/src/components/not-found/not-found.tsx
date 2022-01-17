import { useActiveUserProfile } from '@/src/storage/user-data';
import React, { Fragment } from 'react';
import Navbar from '../util/navbar';

function NotFound() {
    const [{ userName, profileImage }] = useActiveUserProfile();

    return (
        <Fragment>
            <Navbar userName={userName} profileImage={profileImage} />
            <div className="text-center" style={{ marginTop: '20vh', marginBottom: '20vh' }}>
                <p className="font-semibold text-6xl md:text-7xl mb-8 md:mb-11">Oops</p>
                <p className="font-medium text-gray-300 text-3xl md:text-4xl mb-4 md:mb-5">Something Went Wrong</p>
                <p className="font-normal text-gray-300 text-xl md:text-2xl">Error 404 Page Not Found</p>
            </div>
        </Fragment>
    );
}

export default NotFound;

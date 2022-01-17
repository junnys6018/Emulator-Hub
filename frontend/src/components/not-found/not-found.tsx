import getActiveUserUuid from '@/src/storage/get-active-user';
import { useActiveUserProfile } from '@/src/storage/user-data';
import React, { Fragment } from 'react';
import Navbar from '../util/navbar';

function NotFoundContent() {
    return (
        <div className="text-center">
            <p className="font-semibold text-6xl md:text-7xl mb-8 md:mb-11">Oops</p>
            <p className="font-medium text-gray-300 text-3xl md:text-4xl mb-4 md:mb-5">Something Went Wrong</p>
            <p className="font-normal text-gray-300 text-xl md:text-2xl">Error 404 Page Not Found</p>
        </div>
    );
}

function NotFoundLoggedIn() {
    const [{ userName, profileImage }] = useActiveUserProfile();
    return (
        <Fragment>
            <Navbar userName={userName} profileImage={profileImage} />
            <div className="absolute w-full h-full flex flex-col justify-center">
                <NotFoundContent />
            </div>
        </Fragment>
    );
}

export default function NotFound() {
    const activeUser = getActiveUserUuid();

    if (activeUser !== null) {
        return <NotFoundLoggedIn />;
    }

    return (
        <div className="flex-grow flex flex-col justify-center">
            <NotFoundContent />
        </div>
    );
}

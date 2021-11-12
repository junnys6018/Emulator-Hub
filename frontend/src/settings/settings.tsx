import React, { Fragment } from 'react';
import Navbar from '../components/util/navbar';

import profile from '@/public/assets/test-profile.png'; // temporary
import ProfilePicture from './profile-picture';
import Switch from '../components/util/switch';

export default function Settings() {
    return (
        <Fragment>
            <Navbar userName="Jun Lim" profileImage={profile} />
            <div className="container flex flex-col pt-2.5 md:pt-0">
                <ProfilePicture size="130px" profileImage={profile} className="mb-5" />
                <h1 className="font-semibold text-3xl mb-6">Jun Lim</h1>
                <h2 className="font-medium text-xl mb-4">General</h2>
                <div className="flex items-center">
                    <label htmlFor="show-hidden-games" className="mr-auto">
                        Show Hidden Games
                    </label>
                    <Switch id="show-hidden-games" name="show-hidden-games" />
                </div>
            </div>
        </Fragment>
    );
}

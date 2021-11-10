import React, { Fragment } from 'react';
import Navbar from '../util/navbar';

import profile from '@/public/assets/test-profile.png'; // temporary

export default function AddRoms() {
    return (
        <Fragment>
            <Navbar userName="Jun Lim" profileImage={profile} />
        </Fragment>
    );
}

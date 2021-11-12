import React, { Fragment } from 'react';
import Navbar from '../util/navbar';
import AddFileIcon from '@/public/assets/add-file.svg';

import profile from '@/public/assets/test-profile.png'; // temporary
import AddRomForm from './add-rom-form';

export default function AddRoms() {
    return (
        <Fragment>
            <Navbar userName="Jun Lim" profileImage={profile} />
            <div className="container flex flex-col pt-2.5">
                <h1 className="font-semibold text-xl">Add Roms</h1>
                <div className="w-60 h-44 self-center rounded-2xl border-4 border-gray-50 border-dashed flex flex-col items-center justify-center my-12">
                    <AddFileIcon className="mb-6" />
                    <span className="text-2xl">Add Roms</span>
                </div>
                <div className="flex mb-4">
                    <h1 className="font-semibold text-xl mr-auto">New Roms</h1>
                    <button className="btn-primary h-8 px-4 ring-2 ring-inset ring-green-600">Add All</button>
                </div>
                <AddRomForm className="mb-4" id={0} />
                <AddRomForm className="mb-4" id={1} />
                <AddRomForm className="mb-4" id={2} />
                <AddRomForm className="mb-4" id={3} />
            </div>
        </Fragment>
    );
}

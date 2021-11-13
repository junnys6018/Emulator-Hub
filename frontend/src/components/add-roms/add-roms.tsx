import React, { Fragment } from 'react';
import Navbar from '../util/navbar';
import AddFileIcon from '@/public/assets/add-file.svg';

import AddRomForm from './add-rom-form';
import './add-roms.css';
import { useUserProfile } from '@/src/storage/user-data';

export default function AddRoms() {
    const { userName, profileImage } = useUserProfile();
    return (
        <Fragment>
            <Navbar userName={userName} profileImage={profileImage} />
            <div className="container flex flex-col pt-2.5 md:pt-0">
                <h1 className="font-semibold text-xl md:text-3xl">Add Roms</h1>
                <div className="w-60 h-44 md:w-168 md:h-80 self-center rounded-2xl md:rounded-5xl border-4 border-gray-50 border-dashed flex flex-col items-center justify-center my-12">
                    <AddFileIcon className="mb-6 md:transform md:scale-150" />
                    <span className="text-2xl md:hidden">Add Roms</span>
                    <span className="text-2xl hidden md:inline-block">Drag &amp; Drop Your Roms</span>
                </div>
                <div className="flex mb-4 md:mb-8">
                    <h1 className="font-semibold text-xl md:text-3xl mr-auto">New Roms</h1>
                    <button className="btn-primary h-8 md:h-10 px-4 md:px-16 md:text-xl ring-2 md:ring-4 ring-inset ring-green-600">
                        Add All
                    </button>
                </div>
                <div className="add-roms__forms-container">
                    <AddRomForm className="flex-shrink-0 mb-4 md:mr-8" id={0} />
                    <AddRomForm className="flex-shrink-0 mb-4 md:mr-8" id={1} />
                    <AddRomForm className="flex-shrink-0 mb-4 md:mr-8" id={2} />
                    <AddRomForm className="flex-shrink-0 mb-4" id={3} />
                </div>
            </div>
        </Fragment>
    );
}

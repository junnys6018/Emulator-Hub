import React from 'react';
import ThinPlusIcon from '@/public/assets/thin-plus.svg?react';

interface AddProfileProps {
    onClick: () => void;
}

export default function AddProfile(props: AddProfileProps) {
    return (
        <button className="add-profile" onClick={props.onClick}>
            <div
                className="rounded-full border-4 border-gray-300 flex items-center justify-center w-full"
                style={{ aspectRatio: '1' }}
            >
                <ThinPlusIcon />
            </div>
            <span className="inline-block font-medium text-2xl mt-3">Add Profile</span>
        </button>
    );
}

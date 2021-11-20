import { defaultChip8Controls, useUserProfile } from '@/src/storage/user-data';
import { displayKeyCode } from '@/src/util';
import React, { Fragment, useEffect, useState } from 'react';
import { FaRedo, FaTimes } from 'react-icons/fa';
import { SettingsTitle } from './common';

export default function CHIP8Settings() {
    // The button the mouse is hovered over, if any
    const [hoveredButton, setHoveredButton] = useState<number | null>(null);
    // The button that is currently being edited, if any
    const [editingButton, setEditingButton] = useState<number | null>(null);

    const [{ settings }, setUserData] = useUserProfile();
    // Reorders the input keys for the grid
    const keyboardMap = [1, 2, 3, 12, 4, 5, 6, 13, 7, 8, 9, 14, 10, 0, 11, 15];

    const resetAll = () => {
        // Create a deep clone here
        settings.chip8Controls = JSON.parse(JSON.stringify(defaultChip8Controls));
        setUserData({ settings });
    };

    const onChange = (action: number, key: string | null) => {
        if (key === null) {
            key = defaultChip8Controls[action];
        }
        settings.chip8Controls[action] = key as string;
        setUserData({ settings });
    };

    // FIXME: im pretty sure this effect does not depend on `editingButton`
    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (editingButton !== null) {
                onChange(editingButton, e.code);
                setEditingButton(null);
            }
        };

        window.addEventListener('keydown', listener);

        return () => {
            window.removeEventListener('keydown', listener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingButton]);

    return (
        <Fragment>
            <SettingsTitle title="CHIP 8 Controls" />
            <div className="settings__chip8-grid">
                {keyboardMap.map(index => (
                    <div
                        key={index}
                        className="bg-gray-600 rounded-xl relative mr-7 mb-7 flex items-center justify-center"
                        onMouseLeave={() => setHoveredButton(null)}
                        onMouseEnter={() => setHoveredButton(index)}
                    >
                        <span className="absolute top-1 left-2 font-bold text-sm text-gray-400">
                            {index.toString(16).toUpperCase()}
                        </span>
                        {hoveredButton === index && editingButton === null && (
                            <button
                                className="absolute top-2 right-2 focus-visible:outline-none"
                                onClick={() => onChange(index, null)}
                            >
                                <FaRedo size="12px" className="text-primary-500" />
                            </button>
                        )}
                        {editingButton === index && (
                            <button
                                className="absolute top-2 right-2 focus-visible:outline-none"
                                onClick={() => setEditingButton(null)}
                            >
                                <FaTimes size="14px" className="text-red-500" />
                            </button>
                        )}
                        <button
                            className={`text-3xl focus-visible:outline-none ${
                                editingButton === index || (editingButton === null && hoveredButton === index)
                                    ? 'text-primary-500'
                                    : ''
                            }`}
                            onClick={e => {
                                // check e.detail to ensure this button was clicked via mouse button
                                // without this check the user cannot assign space or enter as the control
                                if (editingButton === null && e.detail !== 0) {
                                    setEditingButton(index);
                                }
                            }}
                        >
                            {/* TODO: text fit */}
                            {editingButton === index ? '_' : displayKeyCode(settings.chip8Controls[index])}
                        </button>
                    </div>
                ))}
            </div>
            <button className="btn-secondary mt-auto mb-24 h-10 px-16 w-max" onClick={resetAll}>
                Reset All
            </button>
        </Fragment>
    );
}

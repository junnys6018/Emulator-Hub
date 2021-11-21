import React, { Fragment, useCallback, useEffect, useState } from 'react';
import _ from 'lodash';

import { defaultChip8Controls, useUserProfile } from '@/src/storage/user-data';
import { displayKeyCode } from '@/src/util';
import { FaRedo, FaTimes } from 'react-icons/fa';
import { SettingsTitle } from './common';

// TODO: this function still needs some work
function fontSizeLookup(keyCode: string) {
    if (
        keyCode.startsWith('Key') ||
        keyCode.startsWith('Digit') ||
        /* test for function keys */ /^F\d\d?$/.test(keyCode)
    ) {
        return 'text-3xl';
    }

    if (keyCode.length >= 8) {
        return 'text-xs';
    }
    return 'text-base';
}

export default function CHIP8Settings() {
    // The button the mouse is hovered over, if any
    const [hoveredButton, setHoveredButton] = useState<number | null>(null);
    // The button that is currently being edited, if any
    const [editingButton, setEditingButton] = useState<number | null>(null);

    const clearHoveredButton = () => {
        setHoveredButton(null);
    };

    const clearEditingButton = () => {
        setEditingButton(null);
    };

    const [
        {
            settings: { chip8Controls },
        },
        setUserData,
    ] = useUserProfile();

    const [currentSettings, setCurrentSettings] = useState(_.cloneDeep(chip8Controls));

    const settingsChanged = () => {
        return !_.isEqual(currentSettings, chip8Controls);
    };

    // Reorders the input keys for the grid
    const keyboardMap = [1, 2, 3, 12, 4, 5, 6, 13, 7, 8, 9, 14, 10, 0, 11, 15];

    const resetAll = () => {
        // Create a deep copy here, so that the defaults dont get modified
        setCurrentSettings(_.cloneDeep(defaultChip8Controls));
    };

    const onChange = useCallback(
        (action: number, key: string | null) => {
            if (key === null) {
                key = defaultChip8Controls[action];
            }
            currentSettings[action] = key;
            // Create a deep copy, to trigger a re-render
            setCurrentSettings(_.cloneDeep(currentSettings));
        },
        [currentSettings],
    );

    const onSave = () => {
        if (settingsChanged()) {
            setUserData({ settings: { chip8Controls: currentSettings } });
        }
    };

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
    }, [editingButton, onChange]);

    return (
        <Fragment>
            <SettingsTitle title="CHIP 8 Controls" />
            <div className="settings__chip8-grid">
                {keyboardMap.map(index => (
                    <div
                        key={index}
                        className="bg-gray-600 rounded-xl relative mr-7 mb-7 flex items-center justify-center"
                        onMouseLeave={clearHoveredButton}
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
                                onClick={clearEditingButton}
                            >
                                <FaTimes size="14px" className="text-red-500" />
                            </button>
                        )}
                        <button
                            className={`focus-visible:outline-none ${
                                editingButton === index || (editingButton === null && hoveredButton === index)
                                    ? 'text-primary-500'
                                    : ''
                            } ${fontSizeLookup(currentSettings[index])}`}
                            onClick={e => {
                                // check e.detail to ensure this button was clicked via mouse button
                                // without this check the user cannot assign space or enter as the control
                                if (editingButton === null && e.detail !== 0) {
                                    setEditingButton(index);
                                }
                            }}
                        >
                            {editingButton === index ? '_' : displayKeyCode(currentSettings[index])}
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex mt-auto mb-24">
                <button
                    className={`btn-primary h-10 w-52 mr-20 ${settingsChanged() ? '' : 'disabled'}`}
                    onClick={onSave}
                >
                    Save
                </button>
                <button className="btn-secondary h-10 w-52" onClick={resetAll}>
                    Reset All
                </button>
            </div>
        </Fragment>
    );
}

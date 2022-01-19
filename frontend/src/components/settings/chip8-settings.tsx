import React, { Fragment } from 'react';

import { defaultChip8Controls } from '@/src/storage/user-data';
import { displayKeyCode } from '@/src/util';
import { FaRedo, FaTimes } from 'react-icons/fa';
import { installSettingCallbacks, SettingsComponentProps, SettingsTitle } from './common';
import SettingsButtons from '../util/buttons';

/**
 * Takes a `KeyboardEvent.code` and returns a tailwind font size class so that the
 * rendered keycode fits in its button
 *
 * TODO: this function still needs some work
 *
 * @param keyCode a KeyboardEvent.code
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
 */
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

function CHIP8SettingsComponent(props: SettingsComponentProps<string[]>) {
    // Reorders the input keys for the grid
    const keyboardMap = [1, 2, 3, 12, 4, 5, 6, 13, 7, 8, 9, 14, 10, 0, 11, 15];
    return (
        <Fragment>
            <SettingsTitle title="CHIP 8 Controls" />
            <div className="settings__chip8-grid">
                {keyboardMap.map(index => (
                    <div
                        key={index}
                        className="bg-gray-600 rounded-xl relative mr-7 mb-7 flex items-center justify-center"
                        onMouseLeave={props.clearHoveredButton}
                        onMouseEnter={() => props.setHoveredButton(index)}
                    >
                        <span className="absolute top-1 left-2 font-bold text-sm text-gray-400">
                            {index.toString(16).toUpperCase()}
                        </span>
                        <button
                            className={`focus-visible:outline-none ${
                                props.editingButton === index ||
                                (props.editingButton === null && props.hoveredButton === index)
                                    ? 'text-primary-500'
                                    : ''
                            } ${fontSizeLookup(props.currentSettings[index])}`}
                            onClick={e => {
                                // check e.detail to ensure this button was clicked via mouse button
                                // without this check the user cannot assign space or enter as the control
                                if (props.editingButton === null && e.detail !== 0) {
                                    props.setEditingButton(index);
                                }
                            }}
                        >
                            {props.editingButton === index ? '_' : displayKeyCode(props.currentSettings[index])}
                        </button>
                        {props.hoveredButton === index && props.editingButton === null && (
                            <button
                                className="absolute top-2 right-2 focus-visible:outline-none"
                                onClick={() => props.onChange(index, null)}
                            >
                                <FaRedo size="0.75rem" className="text-primary-500" />
                            </button>
                        )}
                        {props.editingButton === index && (
                            <button
                                className="absolute top-2 right-2 focus-visible:outline-none"
                                onClick={props.clearEditingButton}
                            >
                                <FaTimes size="0.875rem" className="text-red-500" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <SettingsButtons
                settingsChanged={props.settingsChanged}
                onSave={props.onSave}
                resetAll={props.resetAll}
                revert={props.revert}
            />
        </Fragment>
    );
}

const CHIP8Settings = installSettingCallbacks(
    CHIP8SettingsComponent,
    'chip8Controls',
    (key: number, value: string | null, currentSettings: string[]) => {
        if (value === null) {
            value = defaultChip8Controls[key];
        }
        currentSettings[key] = value;
        return currentSettings;
    },
);

export default CHIP8Settings;

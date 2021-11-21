import { displayKeyCode, displayControllerIndex } from '@/src/util';
import { defaultGamepadControls, useUserProfile, GamepadControls } from '@/src/storage/user-data';
import React, { Fragment, useEffect, useState } from 'react';
import { FaRedo, FaTimes } from 'react-icons/fa';
import _ from 'lodash';

interface SettingsTitleProps {
    title: string;
}

export function SettingsTitle(props: SettingsTitleProps) {
    return (
        <Fragment>
            <h2 className="hidden lg:block text-2xl text-gray-500 mb-7">Settings</h2>
            <h1 className="font-medium text-xl mb-4 lg:text-3xl lg:mb-10">{props.title}</h1>
        </Fragment>
    );
}

interface SettingsControlGridProps {
    controls: { [action: string]: [string, number] };
    onChange: (action: string, key: string | number | null) => void;
}

// TODO: game controller settings
function SettingsControlGrid(props: SettingsControlGridProps) {
    // The button the mouse is hovered over, if any
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);
    // The button that is currently being edited, if any
    const [editingButton, setEditingButton] = useState<string | null>(null);
    const controller = false;

    const clearHoveredButton = () => {
        setHoveredButton(null);
    };

    const clearEditingButton = () => {
        setEditingButton(null);
    };

    const { onChange } = props;
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

    const ControlButton = ({ action, display, disabled }: { action: string; display: string; disabled?: boolean }) => {
        return (
            <div
                className={`settings__control-button ${
                    !disabled && (editingButton === action || (editingButton === null && hoveredButton === action))
                        ? 'text-primary-500'
                        : ''
                } 
                ${disabled ? 'disabled' : ''}`}
                onMouseLeave={clearHoveredButton}
                onMouseEnter={() => setHoveredButton(action)}
            >
                <button
                    className={`tracking-wider text-left flex-grow focus-visible:outline-none ${
                        disabled ? 'cursor-not-allowed' : ''
                    }`}
                    onClick={e => {
                        // check e.detail to ensure this button was clicked via mouse button
                        // without this check the user cannot assign space or enter as the control
                        if (!disabled && e.detail !== 0) {
                            setEditingButton(action);
                        }
                    }}
                >
                    {editingButton === action ? 'PRESS A KEY' : display}
                </button>
                {!disabled && hoveredButton === action && editingButton === null && (
                    <button className="px-1 focus-visible:outline-none" onClick={() => props.onChange(action, null)}>
                        <FaRedo size="12px" />
                    </button>
                )}
                {!disabled && editingButton === action && (
                    <button className="px-1 focus-visible:outline-none" onClick={clearEditingButton}>
                        <FaTimes size="14px" className="text-red-500" />
                    </button>
                )}
            </div>
        );
    };

    const gridItems = [];
    for (const key in props.controls) {
        gridItems.push(
            <span key={`${key}-label`} className="py-1 my-1.5 tracking-wider">
                {key.toUpperCase()}
            </span>,
        );
        gridItems.push(
            <ControlButton
                key={`${key}-keyboard`}
                action={`${key}-keyboard`}
                display={displayKeyCode(props.controls[key][0])}
            />,
        );
        gridItems.push(
            <ControlButton
                key={`${key}-controller`}
                action={`${key}-controller`}
                display={displayControllerIndex(props.controls[key][1])}
                disabled={!controller}
            />,
        );
    }

    return (
        <div className="grid grid-cols-3">
            <h3 className="tracking-wider text-gray-400">ACTION</h3>
            <h3 className="tracking-wider text-gray-400 ml-5">KEYBOARD</h3>
            <h3 className="tracking-wider text-gray-400 ml-5">CONTROLLER</h3>
            {gridItems}
        </div>
    );
}

export function _InternalSettings(props: { title: string; controls: 'gbControls' | 'gbcControls' | 'nesControls' }) {
    const [{ settings }, setUserData] = useUserProfile();
    const [currentSettings, setCurrentSettings] = useState(_.cloneDeep(settings[props.controls]));

    const settingsChanged = () => {
        return !_.isEqual(settings[props.controls], currentSettings);
    };

    const onChange = (action: string, key: string | number | null) => {
        if (action.endsWith('keyboard')) {
            action = action.replace(/-keyboard$/, '');
            if (key === null) {
                key = defaultGamepadControls[action as keyof typeof defaultGamepadControls][0];
            }
            currentSettings[action as keyof GamepadControls][0] = key as string;
            setCurrentSettings(_.cloneDeep(currentSettings));
        }
    };

    const onSave = () => {
        if (settingsChanged()) {
            setUserData({ settings: { [props.controls]: currentSettings } });
        }
    };

    const resetAll = () => {
        setCurrentSettings(_.cloneDeep(defaultGamepadControls));
    };

    return (
        <Fragment>
            <SettingsTitle title={props.title} />
            <SettingsControlGrid
                controls={currentSettings as unknown as { [action: string]: [string, number] }}
                onChange={onChange}
            />
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

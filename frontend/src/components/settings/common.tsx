import { displayKeyCode, displayControllerIndex } from '@/src/util';
import { defaultGamepadControls, useUserProfile, GamepadControls } from '@/src/storage/user-data';
import React, { Fragment, useEffect, useState } from 'react';
import { FaRedo, FaTimes } from 'react-icons/fa';

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

    const { onChange } = props;
    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (editingButton) {
                onChange(editingButton, e.code);
                setEditingButton(null);
            }
        };

        window.addEventListener('keydown', listener);

        return () => {
            window.removeEventListener('keydown', listener);
        };
    }, [editingButton, onChange]);

    const ActiveControlButton = ({ action, display }: { action: string; display: string }) => {
        return (
            <div className="settings__control-button items-stretch text-primary-500" onMouseLeave={clearHoveredButton}>
                <button
                    className="tracking-wider text-left flex-grow focus-visible:outline-none"
                    onClick={() => setEditingButton(action)}
                >
                    {editingButton ? 'PRESS A KEY' : display}
                </button>
                <button
                    className="px-1 focus-visible:outline-none"
                    onClick={() => {
                        if (editingButton) {
                            setEditingButton(null);
                        } else {
                            props.onChange(action, null);
                        }
                    }}
                >
                    {editingButton ? <FaTimes size="14px" className="text-red-500" /> : <FaRedo size="12px" />}
                </button>
            </div>
        );
    };

    const ControlButton = ({ action, display, disabled }: { action: string; display: string; disabled?: boolean }) => {
        return (
            <div
                className={`settings__control-button ${disabled ? 'disabled' : ''}`}
                onMouseLeave={clearHoveredButton}
                onMouseEnter={() => setHoveredButton(action)}
            >
                {display}
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
        if (`${key}-keyboard` === editingButton || (!editingButton && `${key}-keyboard` === hoveredButton)) {
            gridItems.push(
                <ActiveControlButton
                    key={`${key}-keyboard`}
                    action={`${key}-keyboard`}
                    display={displayKeyCode(props.controls[key][0])}
                />,
            );
        } else {
            gridItems.push(
                <ControlButton
                    key={`${key}-keyboard`}
                    action={`${key}-keyboard`}
                    display={displayKeyCode(props.controls[key][0])}
                />,
            );
        }

        if (
            controller &&
            (`${key}-controller` === editingButton || (!editingButton && `${key}-controller` === hoveredButton))
        ) {
            gridItems.push(
                <ActiveControlButton
                    key={`${key}-controller`}
                    action={`${key}-controller`}
                    display={displayControllerIndex(props.controls[key][1])}
                />,
            );
        } else {
            gridItems.push(
                <ControlButton
                    key={`${key}-controller`}
                    action={`${key}-controller`}
                    display={displayControllerIndex(props.controls[key][1])}
                    disabled={!controller}
                />,
            );
        }
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

    const onChange = (action: string, key: string | number | null) => {
        if (action.endsWith('keyboard')) {
            action = action.replace(/-keyboard$/, '');
            if (key === null) {
                key = defaultGamepadControls[action as keyof typeof defaultGamepadControls][0];
            }
            settings[props.controls][action as keyof GamepadControls][0] = key as string;
            setUserData({ settings });
        }
    };

    const resetAll = () => {
        // Create a deep clone here
        settings[props.controls] = JSON.parse(JSON.stringify(defaultGamepadControls));
        setUserData({ settings });
    };

    return (
        <Fragment>
            <SettingsTitle title={props.title} />
            <SettingsControlGrid
                controls={
                    settings[props.controls] as unknown as {
                        [action: string]: [string, number];
                    }
                }
                onChange={onChange}
            />
            <button className="btn-secondary mt-auto mb-24 h-10 px-16 w-max" onClick={resetAll}>
                Reset All
            </button>
        </Fragment>
    );
}

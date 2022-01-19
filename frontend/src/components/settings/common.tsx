import React, { Fragment, useCallback, useEffect, useState } from 'react';
import _ from 'lodash';

import { displayKeyCode, displayControllerIndex } from '@/src/util';
import {
    defaultGamepadControls,
    useActiveUserProfile,
    GamepadControls,
    defaultSettings,
} from '@/src/storage/user-data';
import { FaRedo, FaTimes } from 'react-icons/fa';
import { useMessage } from '../util/message';
import { useAlert } from '../util/alert';
import SettingsButtons from '../util/buttons';
import { controllerIndex, useHasGamepad } from '@/src/gamepad';

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

type Key = string | number | null;
export interface SettingsComponentProps<T> {
    clearHoveredButton: () => void;
    setHoveredButton: (key: Key) => void;
    hoveredButton: Key;
    clearEditingButton: () => void;
    setEditingButton: (key: Key) => void;
    editingButton: Key;
    onSave: () => void;
    onChange: (key: string | number, value: string | number | boolean | null) => void;
    settingsChanged: () => boolean;
    resetAll: () => void;
    revert?: () => void;
    currentSettings: T;
}

/**
 * Implements the props needed by a settings component
 * Handles saving and resetting settings, and manages state
 *
 * @param T The type of the underlying settings being managed
 */
export function installSettingCallbacks<T>(
    Component: (props: SettingsComponentProps<T>) => JSX.Element,
    dottedSettingsPath: string,
    onChange: (key: string | number, value: string | number | boolean | null, currentSettings: T) => T,
) {
    return function NewComponent() {
        // The button the mouse is hovered over, if any
        const [hoveredButton, setHoveredButton] = useState<Key>(null);
        // The button that is currently being edited, if any
        const [editingButton, setEditingButton] = useState<Key>(null);

        const clearHoveredButton = () => {
            setHoveredButton(null);
        };

        const clearEditingButton = () => {
            setEditingButton(null);
        };

        const [{ settings }, setUserData] = useActiveUserProfile();

        const innerSettings = _.get(settings, dottedSettingsPath);

        const [currentSettings, setCurrentSettings] = useState(_.cloneDeep(innerSettings));

        // update current settings when the underlying settings in indexedDB changes
        useEffect(() => {
            setCurrentSettings(_.cloneDeep(innerSettings));
        }, [innerSettings]);

        const settingsChanged = () => {
            return !_.isEqual(currentSettings, innerSettings);
        };

        const resetAll = () => {
            // Create a deep copy here, so that the defaults dont get modified
            setCurrentSettings(_.cloneDeep(_.get(defaultSettings, dottedSettingsPath)));
        };

        const revert = () => {
            setCurrentSettings(_.cloneDeep(innerSettings));
        };

        const message = useMessage();
        const alert = useAlert();

        const onSave = () => {
            if (settingsChanged()) {
                setUserData(_.set({}, `settings.${dottedSettingsPath}`, currentSettings)).then(
                    () => message('Settings saved', { title: 'Success', severity: 'SUCCESS' }),
                    error => alert(`${error}`, { title: 'Error', severity: 'ERROR' }),
                );
            }
        };

        const onChangeWrapper = useCallback(
            (key: string | number, value: string | number | boolean | null) => {
                const newSettings = onChange(key, value, currentSettings);
                // Create a deep copy, to trigger a re-render
                setCurrentSettings(_.cloneDeep(newSettings));
            },
            [currentSettings],
        );

        // Attach event listener for keyboard events
        useEffect(() => {
            const listener = (e: KeyboardEvent) => {
                if (editingButton !== null) {
                    if (typeof editingButton === 'string' && editingButton.endsWith('controller')) {
                        // If the editing button was for the controller settings, return
                        return;
                    }

                    onChangeWrapper(editingButton, e.code);
                    setEditingButton(null);
                }
            };

            window.addEventListener('keydown', listener);

            return () => {
                window.removeEventListener('keydown', listener);
            };
        }, [editingButton, onChangeWrapper]);

        // Attach event listener for controller events
        useEffect(() => {
            const pollGamepad = () => {
                id = requestAnimationFrame(pollGamepad);

                if (controllerIndex === null) {
                    return;
                }

                const gamepad = navigator.getGamepads()[controllerIndex];
                if (gamepad !== null) {
                    if (typeof editingButton === 'string' && editingButton.endsWith('controller')) {
                        for (let i = 0; i < gamepad.buttons.length; i++) {
                            if (gamepad.buttons[i].pressed) {
                                onChangeWrapper(editingButton, i);
                                setEditingButton(null);
                                return;
                            }
                        }
                    }
                }
            };

            let id = requestAnimationFrame(pollGamepad);

            return () => {
                cancelAnimationFrame(id);
            };
        }, [editingButton, onChangeWrapper]);

        return (
            <Component
                clearHoveredButton={clearHoveredButton}
                setHoveredButton={setHoveredButton}
                hoveredButton={hoveredButton}
                clearEditingButton={clearEditingButton}
                setEditingButton={setEditingButton}
                editingButton={editingButton}
                onSave={onSave}
                onChange={onChangeWrapper}
                settingsChanged={settingsChanged}
                resetAll={resetAll}
                revert={revert}
                currentSettings={currentSettings}
            />
        );
    };
}

function ControllerSettingsComponent(props: SettingsComponentProps<GamepadControls>) {
    const controller = useHasGamepad();

    const {
        editingButton,
        clearEditingButton,
        setEditingButton,
        hoveredButton,
        clearHoveredButton,
        setHoveredButton,
        onChange,
    } = props;

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
                        if (!disabled && editingButton === null && e.detail !== 0) {
                            setEditingButton(action);
                        }
                    }}
                >
                    {editingButton === action ? 'PRESS A KEY' : display}
                </button>
                {!disabled && hoveredButton === action && editingButton === null && (
                    <button className="px-1 focus-visible:outline-none" onClick={() => onChange(action, null)}>
                        <FaRedo size="0.75rem" />
                    </button>
                )}
                {!disabled && editingButton === action && (
                    <button className="px-1 focus-visible:outline-none" onClick={clearEditingButton}>
                        <FaTimes size="0.875rem" className="text-red-500" />
                    </button>
                )}
            </div>
        );
    };

    const gridItems = [];
    for (const key in props.currentSettings) {
        gridItems.push(
            <span key={`${key}-label`} className="py-1 my-1.5 tracking-wider">
                {key.toUpperCase()}
            </span>,
        );
        gridItems.push(
            <ControlButton
                key={`${key}-keyboard`}
                action={`${key}-keyboard`}
                display={displayKeyCode(props.currentSettings[key as keyof GamepadControls][0])}
            />,
        );
        gridItems.push(
            <ControlButton
                key={`${key}-controller`}
                action={`${key}-controller`}
                display={displayControllerIndex(props.currentSettings[key as keyof GamepadControls][1])}
                disabled={!controller}
            />,
        );
    }

    return (
        <Fragment>
            <div className="settings__controller-grid">
                <h3 className="tracking-wider text-gray-400">ACTION</h3>
                <h3 className="tracking-wider text-gray-400 ml-5">KEYBOARD</h3>
                <h3 className="tracking-wider text-gray-400 ml-5">CONTROLLER</h3>
                {gridItems}
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

export function makeControllerSettingsComponent(path: string) {
    return installSettingCallbacks(
        ControllerSettingsComponent,
        path,
        (key: string, value: string | number | null, currentSettings: GamepadControls) => {
            if (key.endsWith('keyboard')) {
                key = key.replace(/-keyboard$/, '');
                if (value === null) {
                    value = defaultGamepadControls[key as keyof typeof defaultGamepadControls][0];
                }

                if (typeof value === 'string') {
                    currentSettings[key as keyof GamepadControls][0] = value;
                }

                return currentSettings;
            } else if (key.endsWith('controller')) {
                key = key.replace(/-controller$/, '');

                if (value === null) {
                    value = defaultGamepadControls[key as keyof typeof defaultGamepadControls][1];
                }

                if (typeof value === 'number') {
                    currentSettings[key as keyof GamepadControls][1] = value;
                }

                return currentSettings;
            }
        },
    );
}

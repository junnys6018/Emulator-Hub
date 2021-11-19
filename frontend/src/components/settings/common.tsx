import { displayKeyCode, displayControllerIndex } from '@/src/util';
import React, { Fragment, useEffect, useState } from 'react';
import { FaRedo, FaTimes } from 'react-icons/fa';

interface SettingsTitleProps {
    title: string;
}

export function SettingsTitle(props: SettingsTitleProps) {
    return (
        <Fragment>
            <h2 className="text-2xl text-gray-500 mb-7">Settings</h2>
            <h1 className="text-3xl mb-10">{props.title}</h1>
        </Fragment>
    );
}

interface SettingsControlGridProps {
    controls: { [action: string]: [string, number] };
    onChange: (action: string, key: string | number | null) => void;
}

export function SettingsControlGrid(props: SettingsControlGridProps) {
    const [activeButton, setActiveButton] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const controller = false;

    const clearActiveButton = () => {
        if (!editing) setActiveButton(null);
    };

    const { onChange } = props;
    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (activeButton && activeButton.endsWith('keyboard') && editing) {
                onChange(activeButton, e.code);
                setEditing(false);
            }
        };

        window.addEventListener('keydown', listener);

        return () => {
            window.removeEventListener('keydown', listener);
        };
    }, [activeButton, editing, onChange]);

    const ActiveControlButton = ({ action, display }: { action: string; display: string }) => {
        return (
            <div className="settings__control-button flex text-primary-500" onMouseLeave={clearActiveButton}>
                <button
                    className="tracking-wider text-left flex-grow focus-visible:outline-none"
                    onClick={() => setEditing(true)}
                >
                    {editing ? 'PRESS A KEY' : display}
                </button>
                <button
                    className="px-1 focus-visible:outline-none"
                    onClick={() => {
                        if (editing) {
                            setEditing(false);
                        } else {
                            props.onChange(action, null);
                        }
                    }}
                >
                    {editing ? <FaTimes size="14px" className="text-red-500" /> : <FaRedo size="12px" />}
                </button>
            </div>
        );
    };

    const ControlButton = ({ action, display, disabled }: { action: string; display: string; disabled?: boolean }) => {
        return (
            <div
                className={`settings__control-button ${disabled ? 'disabled' : ''}`}
                onMouseLeave={clearActiveButton}
                onMouseEnter={() => {
                    if (!editing) setActiveButton(action);
                }}
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
        if (`${key}-keyboard` === activeButton) {
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

        if (`${key}-controller` === activeButton && controller) {
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

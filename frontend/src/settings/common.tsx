import React, { Fragment } from 'react';

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
    actions: string[];
    defaultKeyboard: string[];
    defaultController: string[];
}

export function SettingsControlGrid(props: SettingsControlGridProps) {
    const gridItems = [];
    for (let i = 0; i < props.actions.length; i++) {
        gridItems.push(
            <span key={3 * i + 0} className="py-1 my-1.5 tracking-wider">
                {props.actions[i]}
            </span>,
        );
        gridItems.push(
            <button key={3 * i + 1} className="settings__control-button">
                {props.defaultKeyboard[i]}
            </button>,
        );
        gridItems.push(
            <button key={3 * i + 2} className="settings__control-button disabled">
                {props.defaultController[i]}
            </button>,
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

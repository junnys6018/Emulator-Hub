import { displayKeyCode, displayControllerIndex } from '@/src/util';
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
    controls: { [action: string]: [string, number] };
}

export function SettingsControlGrid(props: SettingsControlGridProps) {
    const gridItems = [];
    for (const key in props.controls) {
        gridItems.push(
            <span key={`${key}-label`} className="py-1 my-1.5 tracking-wider">
                {key.toUpperCase()}
            </span>,
        );
        gridItems.push(
            <button key={`${key}-keyboard`} className="settings__control-button">
                {displayKeyCode(props.controls[key][0])}
            </button>,
        );
        gridItems.push(
            <button key={`${key}-controller`} className="settings__control-button disabled">
                {displayControllerIndex(props.controls[key][1])}
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

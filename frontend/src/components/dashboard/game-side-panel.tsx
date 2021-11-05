import React from 'react';
import { FaArrowLeft, FaEdit, FaPlay, FaPlus } from 'react-icons/fa';
import classNames from 'classnames';
import './game-side-panel.css';

interface GameSidePanelProps {
    image?: string;
    name?: string;
    saveNames?: string[];
    activeSaveIndex?: number;
    closePanel: () => void;
    className?: string;
}

// TODO: swipe right to close
// TODO: better integration with back button on android

export default function GameSidePanel(props: GameSidePanelProps) {
    if (props.name === undefined) {
        return <div className={props.className}></div>;
    }

    const saves = props.saveNames?.map((save, index) => {
        return (
            <div
                key={save}
                className={`
                    ${index % 2 === 0 ? 'bg-gray-700 lg:bg-gray-600' : 'bg-gray-800 lg:bg-gray-700'}
                    ${index === props.activeSaveIndex ? 'text-primary-500' : ''}
                `}
            >
                <div className="container h-12 flex items-center">
                    <span
                        className={`text-lg mr-auto ${
                            index === props.activeSaveIndex ? 'game-side-panel__circle' : ''
                        }`}
                    >
                        {save}
                    </span>
                    {index === props.activeSaveIndex && <span className="text-lg">Active</span>}
                </div>
            </div>
        );
    });

    return (
        <div className={classNames('flex flex-col overflow-y-auto bg-gray-800 lg:bg-gray-700', props.className)}>
            <div className="h-1 flex-shrink-0 bg-primary-500"></div>
            <div className="container flex flex-col">
                <div className="flex items-center py-5 md:py-8">
                    <button
                        className="mr-3 flex-shrink-0 active:text-green-500 hover:text-green-500"
                        onClick={props.closePanel}
                    >
                        <FaArrowLeft size="20px" />
                    </button>
                    <h1 className="mr-auto font-semibold text-2xl truncate">{props.name}</h1>
                    <button className="flex-shrink-0 active:text-green-500 hover:text-green-500">
                        <FaEdit size="20px" />
                    </button>
                </div>
                <img
                    className="rounded-2xl pixelated drop-shadow object-center object-cover md:max-w-sm mx-auto"
                    src={props.image}
                ></img>
                <h2 className="font-medium text-2xl pt-6 pb-2 md:py-6">Saves</h2>
            </div>
            {saves}
            <div className="container flex flex-col mt-2">
                <button className="text-gray-300 active:text-green-500 hover:text-green-500 flex items-center mb-9 w-max">
                    <span className="font-medium text-xs mr-1">Add Save</span>
                    <FaPlus size="8px" />
                </button>
                <h2 className="font-medium text-2xl mb-2">Settings</h2>
                <form className="mb-10">
                    <input name="hidden" id="hidden" type="checkbox" className="mr-2"></input>
                    <label htmlFor="hidden" className="text-sm font-medium">
                        Hidden
                    </label>
                </form>
            </div>
            <div className="container mt-auto">
                <button className="btn-primary mb-10 h-12 w-full">
                    <FaPlay className="mr-4" size="12px" />
                    <span className="font-medium text-2xl">Play</span>
                </button>
            </div>
        </div>
    );
}

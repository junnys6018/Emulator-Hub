import { useGameMetaData } from '@/src/storage/game-data';
import React, { Fragment, useCallback, useState } from 'react';
import { FaArrowLeft, FaEdit, FaPlay, FaPlus } from 'react-icons/fa';
import { useAlert } from '../util/alert';
import './game-side-panel.css';

interface GameSidePanelProps {
    image: string;
    imageRendering: 'pixelated' | 'unset';
    name: string;
    saveNames: string[];
    activeSaveIndex: number;
    gameUuid: string;
    closePanel: () => void;
}

// TODO: swipe right to close
// TODO: better integration with back button on android
// FIXME: jerky behavour when adding save caused by re-rendering when calling putGameMetaData
export default function GameSidePanel(props: GameSidePanelProps) {
    const [addingSave, setAddingSave] = useState(false);
    const [newSaveName, setNewSaveName] = useState('');
    const [, putGameMetaData] = useGameMetaData();

    const onAddSaveClick = useCallback(() => {
        setAddingSave(true);
        setNewSaveName(`Save ${props.saveNames.length + 1}`);
    }, [props.saveNames.length]);

    const alert = useAlert();

    const onAddSaveDelete = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent form submission
        setAddingSave(false);
    }, []);

    const onAddSaveSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            putGameMetaData({
                saveNames: props.saveNames.concat([newSaveName]),
                uuid: props.gameUuid,
            }).catch(error => alert(`${error}`, { title: 'Error', severity: 'ERROR' }));
            setAddingSave(false);
        },
        [alert, newSaveName, props.gameUuid, props.saveNames, putGameMetaData],
    );

    const setActiveSave = useCallback(
        (index: number) => {
            putGameMetaData({
                activeSaveIndex: index,
                uuid: props.gameUuid,
            });
        },
        [props.gameUuid, putGameMetaData],
    );

    const saves = props.saveNames?.map((save, index) => {
        return (
            <div
                key={save}
                className={`
                    ${index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}
                    ${index === props.activeSaveIndex ? 'text-primary-500' : ''}
                `}
            >
                <div
                    className={`container h-12 flex items-center ${
                        index === props.activeSaveIndex ? 'game-side-panel__circle' : ''
                    }`}
                >
                    <button className="text-lg mr-auto truncate" onClick={() => setActiveSave(index)}>
                        {save}
                    </button>
                    {index === props.activeSaveIndex && <span className="text-lg">Active</span>}
                </div>
            </div>
        );
    });

    return (
        <Fragment>
            <div className="h-1 flex-shrink-0 bg-primary-500"></div>
            <div className="flex flex-grow flex-col overflow-y-auto bg-gray-800">
                <div className="container flex flex-col">
                    <div className="flex items-center py-5 md:py-8">
                        <button
                            className="mr-3 flex-shrink-0 active:text-green-500 md:hover:text-green-500"
                            onClick={props.closePanel}
                        >
                            <FaArrowLeft size="20px" />
                        </button>
                        <h1 className="mr-auto font-semibold text-2xl truncate">{props.name}</h1>
                        <button className="flex-shrink-0 active:text-green-500 md:hover:text-green-500">
                            <FaEdit size="20px" />
                        </button>
                    </div>
                    <img
                        className="rounded-2xl filter drop-shadow object-center object-cover w-full md:w-96 mx-auto"
                        style={{ aspectRatio: '1', imageRendering: props.imageRendering }}
                        src={props.image}
                    ></img>
                    <h2 className="font-medium text-2xl pt-6 pb-2 md:py-6">Saves</h2>
                </div>
                {saves}
                {addingSave && (
                    <div className={props.saveNames.length % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}>
                        <form onSubmit={onAddSaveSubmit} className="container h-12 flex items-center">
                            <input
                                id="new-save-name"
                                name="new-save-name"
                                type="text"
                                value={newSaveName}
                                onChange={e => setNewSaveName(e.currentTarget.value)}
                                className="appearance-none w-40 xs:w-52 text-lg mr-auto bg-gray-900 rounded-lg h-9 transform -translate-x-3 px-3 focus:outline-none"
                            ></input>
                            <label
                                htmlFor="new-save-submit"
                                className="font-medium text-green-500 md:hover:text-green-400 active:text-green-400 cursor-pointer mr-4"
                            >
                                <input
                                    id="new-save-submit"
                                    name="new-save-submit"
                                    type="submit"
                                    className="hidden"
                                ></input>
                                Add
                            </label>
                            <button
                                onClick={onAddSaveDelete}
                                className="font-medium md:hover:text-red-500 active:text-red-500"
                            >
                                Delete
                            </button>
                        </form>
                    </div>
                )}
                {!addingSave && (
                    <div className="container h-12 flex-shrink-0">
                        <button
                            onClick={onAddSaveClick}
                            className="text-gray-300 active:text-green-500 md:hover:text-green-500 flex items-center w-max mt-1"
                        >
                            <span className="font-medium text-xs mr-1">Add Save</span>
                            <FaPlus size="8px" />
                        </button>
                    </div>
                )}
                <div className="container flex flex-col mt-2">
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
        </Fragment>
    );
}

import { useGameMetaData } from '@/src/storage/game-data';
import _ from 'lodash';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaEdit, FaPlay, FaPlus, FaTrashAlt, FaSave, FaRedo, FaInfoCircle } from 'react-icons/fa';
import { useAlert } from '../util/alert';
import { useMessage } from '../util/message';
import './game-side-panel.css';

interface GameSidePanelProps {
    image: string;
    imageRendering: 'pixelated' | 'unset';
    hidden: boolean;
    deletable: boolean;
    name: string;
    saveNames: string[];
    activeSaveIndex: number;
    gameUuid: string;
    closePanel: () => void;
}

/**
 * Given the old save index and a list of indices marked for deletion, returns the new index of the active save
 * if the active save is marked for deletion, returns 0
 *
 * For example, if we have 5 saves, a b c d e, and save c at index 2 is the active save, if saves a and d being marked for deletion
 * then after the deletion the saves are b c e, with save c now at index 1.
 *
 * @returns The new save index
 */
export function newSaveIndex(deleteSaveIndices: Set<number>, activeSaveIndex: number): number {
    if (deleteSaveIndices.has(activeSaveIndex)) {
        return 0;
    }
    let count = 0;
    for (const index of deleteSaveIndices) {
        if (index < activeSaveIndex) {
            count++;
        }
    }
    return activeSaveIndex - count;
}

interface ImageRenderingSettingsProps {
    imageRendering: 'pixelated' | 'unset';
    setImageRendering?: (value: React.SetStateAction<'pixelated' | 'unset'>) => void;
    disabled: boolean;
}

function ImageRenderingSettings(props: ImageRenderingSettingsProps) {
    const alert = useAlert();

    return (
        <div className="flex flex-wrap items-center mb-8">
            <span
                className={`flex-shrink-0 text-sm font-medium cursor-not-allowed mr-auto sm:mr-3 mb-2 sm:mb-0 ${
                    props.disabled ? 'text-gray-400' : ''
                }`}
            >
                Image Rendering
            </span>
            <div className="mr-auto flex-shrink-0 order-last sm:order-none flex items-center">
                <input
                    disabled={props.disabled}
                    type="radio"
                    id="nearest-neighbour"
                    value="pixelated"
                    name="image-rendering"
                    checked={props.imageRendering === 'pixelated'}
                    onChange={() => {
                        if (props.setImageRendering) {
                            props.setImageRendering('pixelated');
                        }
                    }}
                ></input>
                <label htmlFor="nearest-neighbour" className="mr-4 text-sm">
                    Nearest Neighbour
                </label>
                <input
                    disabled={props.disabled}
                    type="radio"
                    id="bilinear"
                    value="unset"
                    name="image-rendering"
                    checked={props.imageRendering === 'unset'}
                    onChange={() => {
                        if (props.setImageRendering) {
                            props.setImageRendering('unset');
                        }
                    }}
                ></input>
                <label htmlFor="bilinear" className="text-sm">
                    Bilinear
                </label>
            </div>
            <button
                type="button"
                className="md:hover:text-green-400 active:text-green-400"
                onClick={() =>
                    alert(
                        'Determines how the rom image is rendered. Use nearest neighbour for low resolution pixelated images (such as pixel art), and use bilinear for other images.',
                        { title: 'Information', severity: 'SUCCESS' },
                    )
                }
            >
                <FaInfoCircle size="1.25rem" />
            </button>
        </div>
    );
}

function GameSidePanelForm(props: GameSidePanelProps & { toggleEdit: () => void }) {
    const [, putGameMetaData, deleteGame] = useGameMetaData();

    const [romName, setRomName] = useState(props.name);
    const [saveNames, setSaveNames] = useState(_.cloneDeep(props.saveNames));
    const [hidden, setHidden] = useState(props.hidden);
    const [imageRendering, setImageRendering] = useState(props.imageRendering);
    const [romNameError, setRomNameError] = useState(false);
    const [saveNameErrors, setSaveNameErrors] = useState(new Set<number>());

    // Set of save indices to delete
    const [deleteSaveIndices, setDeleteSaveIndices] = useState(new Set<number>());

    const backgroundImageDiv = useRef<HTMLDivElement>(null);
    const backgroundImageUrl: React.MutableRefObject<string | null> = useRef<string>(null);
    const imageInput = useRef<HTMLInputElement>(null);

    const message = useMessage();
    const alert = useAlert();

    useEffect(() => {
        return () => {
            if (backgroundImageUrl.current !== null) {
                // Free memory when component is destroyed
                URL.revokeObjectURL(backgroundImageUrl.current);
            }
        };
    }, []);

    const onImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files) {
            if (backgroundImageUrl.current !== null) {
                URL.revokeObjectURL(backgroundImageUrl.current);
            }

            const image = e.currentTarget.files[0];
            backgroundImageUrl.current = URL.createObjectURL(image);
            const element = backgroundImageDiv.current as HTMLDivElement;
            element.style.backgroundImage = `url(${backgroundImageUrl.current})`;
        }
    }, []);

    const onSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            // Validate form
            let error = false;
            const sanitizedRomName = romName.trim();
            if (sanitizedRomName === '') {
                setRomNameError(true);
                error = true;
            } else {
                setRomNameError(false);
            }

            const saveNameErrors = new Set<number>();
            const sanitizedSaveNames = saveNames.map(save => save.trim());
            for (let i = 0; i < sanitizedSaveNames.length; i++) {
                if (sanitizedSaveNames[i] === '' && !deleteSaveIndices.has(i)) {
                    // If the save name is empty and its not marked for deletion
                    saveNameErrors.add(i);
                    error = true;
                }
            }
            setSaveNameErrors(saveNameErrors);

            if (error) {
                return;
            }

            let image: File | undefined = undefined;
            if (imageInput.current?.files?.length !== 0) {
                image = (imageInput.current?.files as FileList)[0];
            }

            const commit = () => {
                putGameMetaData({
                    name: sanitizedRomName,
                    image,
                    saveNames: sanitizedSaveNames.filter((_, index) => !deleteSaveIndices.has(index)),
                    activeSaveIndex: newSaveIndex(deleteSaveIndices, props.activeSaveIndex),
                    settings: {
                        imageRendering,
                        hidden: hidden,
                    },
                    uuid: props.gameUuid,
                }).then(
                    () => props.toggleEdit(),
                    error => alert(`${error}`, { severity: 'ERROR' }),
                );
                // for (const index of deleteSaveIndices) {
                //     // TODO: delete save from GameData
                // }
            };

            if (deleteSaveIndices.size === 0) {
                commit();
            } else {
                alert(
                    'Are you sure that you want to save your changes? Any saves marked for deletion will be permanently removed.',
                    {
                        severity: 'ERROR',
                        action: 'CONFIRM',
                        callback: action => {
                            if (action === 'YES') {
                                commit();
                            }
                        },
                    },
                );
            }
        },
        [alert, deleteSaveIndices, hidden, imageRendering, props, putGameMetaData, romName, saveNames],
    );

    const saves = saveNames.map((save, index) => {
        return (
            <div key={index} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}>
                <div className="container h-12 flex items-center">
                    {deleteSaveIndices.has(index) ? (
                        <Fragment>
                            <span className="text-lg font-medium text-gray-500 w-40 xs:w-52 truncate mr-auto line-through inline-block">
                                {save.trim() ? save : 'Save'}
                            </span>
                            <button
                                onClick={() =>
                                    setDeleteSaveIndices(deleteSaveIndices => {
                                        deleteSaveIndices.delete(index);
                                        return new Set(deleteSaveIndices);
                                    })
                                }
                                type="button"
                                className="text-green-500 md:hover:text-green-400 active:text-green-400"
                            >
                                <FaRedo />
                            </button>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <input
                                id={`save-name-${index}`}
                                name={`save-name-${index}`}
                                type="text"
                                value={save}
                                onChange={e => {
                                    const value = e.currentTarget.value;
                                    setSaveNames(saveNames => {
                                        saveNames[index] = value;
                                        return [...saveNames];
                                    });
                                }}
                                className="appearance-none w-40 xs:w-52 text-lg mr-auto bg-gray-900 rounded-lg h-9 transform -translate-x-3 px-3 focus:outline-none"
                            ></input>
                            {saveNameErrors.has(index) && (
                                <span className="text-sm text-red-500 mr-4">This Field Is Required</span>
                            )}
                            <button
                                onClick={() => {
                                    if (deleteSaveIndices.size + 1 === saveNames.length) {
                                        message('Cannot delete your last save', { severity: 'WARN' });
                                    } else {
                                        setDeleteSaveIndices(
                                            deleteSaveIndices => new Set(deleteSaveIndices.add(index)),
                                        );
                                    }
                                }}
                                type="button"
                                className="text-red-500 md:hover:text-red-400 active:text-red-400"
                            >
                                <FaTrashAlt />
                            </button>
                        </Fragment>
                    )}
                </div>
            </div>
        );
    });

    return (
        <Fragment>
            <form className="flex flex-col flex-grow" onSubmit={onSubmit}>
                <div className="container flex flex-col">
                    <div className="flex items-center py-2 md:py-5">
                        <button
                            className="mr-6 flex-shrink-0 active:text-green-500 md:hover:text-green-500"
                            onClick={props.closePanel}
                            type="button"
                        >
                            <FaArrowLeft size="1.25rem" />
                        </button>
                        <input
                            id="rom-name"
                            name="rom-name"
                            value={romName}
                            onChange={e => setRomName(e.currentTarget.value)}
                            className="appearance-none bg-gray-900 rounded-lg transform -translate-x-3 px-3 h-14 focus:outline-none mr-auto font-semibold text-2xl truncate"
                        ></input>
                        {props.deletable && (
                            <button
                                type="button"
                                className="flex-shrink-0 text-red-500 active:text-red-400 md:hover:text-red-400"
                                onClick={() =>
                                    alert('Are you sure that you want to permanently delete this game?', {
                                        severity: 'ERROR',
                                        action: 'CONFIRM',
                                        callback: action => {
                                            if (action === 'YES') {
                                                props.closePanel();
                                                deleteGame(props.gameUuid).catch(error =>
                                                    alert(error, { severity: 'ERROR' }),
                                                );
                                            }
                                        },
                                    })
                                }
                            >
                                <FaTrashAlt size="1.625rem" />
                            </button>
                        )}
                    </div>
                    <div
                        ref={backgroundImageDiv}
                        className="flex items-center justify-center rounded-2xl filter drop-shadow bg-center bg-cover bg-blend-multiply w-full md:w-96 mx-auto"
                        style={{
                            aspectRatio: '1',
                            imageRendering: props.imageRendering,
                            backgroundImage: `url(${props.image})`,
                            backgroundColor: 'rgb(128, 128, 128)',
                        }}
                    >
                        <label htmlFor="rom-image" className="btn-secondary h-10 px-2.5 text-primary-100">
                            <input
                                className="hidden"
                                type="file"
                                id="rom-image"
                                name="rom-image"
                                onChange={onImageChange}
                                ref={imageInput}
                                accept="image/png, image/jpeg"
                            ></input>
                            Change Image
                        </label>
                    </div>
                    <h2 className="font-medium text-2xl pt-6 pb-2 md:py-6">Saves</h2>
                </div>
                {saves}
                <div className="container flex flex-col mt-14">
                    <h2 className="font-medium text-2xl mb-2">Settings</h2>
                    <div className="mb-2">
                        <input
                            name="hidden"
                            id="hidden"
                            type="checkbox"
                            className="mr-2"
                            checked={hidden}
                            onChange={e => setHidden(e.currentTarget.checked)}
                        ></input>
                        <label htmlFor="hidden" className="text-sm font-medium align-text-top">
                            Hidden
                        </label>
                    </div>
                    <ImageRenderingSettings
                        imageRendering={imageRendering}
                        setImageRendering={setImageRendering}
                        disabled={false}
                    />
                    {romNameError && <span className="text-red-500 mb-2">Missing Rom Name</span>}
                </div>
                <div className="container mb-10 mt-auto flex">
                    <button className="btn-primary flex-grow h-12 mr-7" type="submit">
                        <FaSave className="mr-4" size="1.125rem" />
                        <span className="font-medium text-2xl">Save</span>
                    </button>
                    <button
                        onClick={props.toggleEdit}
                        type="button"
                        className="btn-secondary md:hover:text-red-500 md:hover:ring-red-500 active:text-red-500 active:ring-red-500 flex-grow h-12"
                    >
                        <span className="font-medium text-2xl">Cancel</span>
                    </button>
                </div>
            </form>
        </Fragment>
    );
}

// FIXME: jerky behavour when adding save caused by re-rendering when calling putGameMetaData
function GameSidePanelView(props: GameSidePanelProps & { toggleEdit: () => void }) {
    const [addingSave, setAddingSave] = useState(false);
    const [newSaveName, setNewSaveName] = useState('');
    const [, putGameMetaData] = useGameMetaData();

    const addSaveInput = useRef<HTMLInputElement>(null);

    const onAddSaveClick = useCallback(() => {
        setAddingSave(true);
        setNewSaveName(`Save ${props.saveNames.length + 1}`);
    }, [props.saveNames.length]);

    // Whenever addingSave changes to true we want to focus on the add save input element
    // we have to do this in an effect hook instead of inside onAddSaveClick because
    // the input element does not exist while onAddSaveClick is running, we have to run
    // this code after the component re-renders. This is a bit ugly but it works.
    useEffect(() => {
        if (addingSave) {
            addSaveInput.current?.focus();
        }
    }, [addingSave]);

    const alert = useAlert();

    const onAddSaveDelete = useCallback(() => {
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
                key={index}
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
                    <button
                        className="text-lg mr-auto truncate flex-grow text-left"
                        onClick={() => setActiveSave(index)}
                    >
                        {save}
                    </button>
                    {index === props.activeSaveIndex && <span className="text-lg">Active</span>}
                </div>
            </div>
        );
    });

    return (
        <Fragment>
            <div className="container flex flex-col">
                <div className="flex items-center py-5 md:py-8">
                    <button
                        className="mr-6 flex-shrink-0 active:text-green-500 md:hover:text-green-500"
                        onClick={props.closePanel}
                    >
                        <FaArrowLeft size="1.25rem" />
                    </button>
                    <h2 className="mr-auto font-semibold text-2xl truncate">{props.name}</h2>
                    <button
                        onClick={props.toggleEdit}
                        className="flex-shrink-0 active:text-green-500 md:hover:text-green-500"
                    >
                        <FaEdit size="1.25rem" />
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
                            ref={addSaveInput}
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
                            <input id="new-save-submit" name="new-save-submit" type="submit" className="hidden"></input>
                            Add
                        </label>
                        <button
                            onClick={onAddSaveDelete}
                            type="button"
                            className="font-medium text-red-500 md:hover:text-red-400 active:text-red-400"
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
                        <FaPlus size="0.5rem" />
                    </button>
                </div>
            )}
            <div className="container flex flex-col mt-2">
                <h2 className="font-medium text-2xl mb-2">Settings</h2>
                <div className="mb-2">
                    <input
                        disabled
                        name="hidden"
                        id="hidden"
                        type="checkbox"
                        className="mr-2"
                        checked={props.hidden}
                    ></input>
                    <label htmlFor="hidden" className="text-sm font-medium align-text-top">
                        Hidden
                    </label>
                </div>
                <ImageRenderingSettings disabled imageRendering={props.imageRendering} />
            </div>
            <div className="container mt-auto">
                <button className="btn-primary mb-10 h-12 w-full">
                    <FaPlay className="mr-4" size="0.75rem" />
                    <span className="font-medium text-2xl">Play</span>
                </button>
            </div>
        </Fragment>
    );
}

// TODO: swipe right to close
// TODO: better integration with back button on android
export default function GameSidePanel(props: GameSidePanelProps) {
    const [editing, setEditing] = useState(false);
    const toggleEdit = useCallback(() => setEditing(old => !old), [setEditing]);

    const content = editing ? (
        <GameSidePanelForm {...props} toggleEdit={toggleEdit} />
    ) : (
        <GameSidePanelView {...props} toggleEdit={toggleEdit} />
    );
    return (
        <Fragment>
            <div className="h-1 flex-shrink-0 bg-primary-500"></div>
            <div className="flex flex-grow flex-col overflow-y-auto bg-gray-800">{content}</div>
        </Fragment>
    );
}

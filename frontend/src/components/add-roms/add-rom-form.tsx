import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Console, putGameData, useGameMetaData } from '@/src/storage/game-data';
import { FaPlus } from 'react-icons/fa';
import classNames from 'classnames';
import getActiveUserUuid from '@/src/storage/get-active-user';
import { v4 as uuidv4 } from 'uuid';
import { useAlert } from '../util/alert';
import { useMessage } from '../util/message';
import { useDatabase } from '@/src/storage/storage';
import DefaultRomImage from '@/public/assets/default-rom-image.png';

interface AddRomFormProps {
    id: number;
    className?: string;
    initialName: string;
    inititalConsole: Console;
    file: File;
    onDelete: () => void;
}

const defaultRomImage = fetch(DefaultRomImage).then(response => response.blob());

export default function AddRomForm(props: AddRomFormProps) {
    const [name, setName] = useState(props.initialName);
    const [gameConsole, setGameConsole] = useState<Console>(props.inititalConsole);
    const [nameError, setNameError] = useState(false);
    const [gameConsoleError, setGameConsoleError] = useState(false);

    const [, putGameMetaData] = useGameMetaData();

    const backgroundImageDiv = useRef<HTMLDivElement>(null);
    const backgroundImageUrl: React.MutableRefObject<string | null> = useRef<string>(null);
    const imageInput = useRef<HTMLInputElement>(null);

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
            element.style.backgroundColor = 'rgb(128, 128, 128)';
        }
    }, []);

    const message = useMessage();
    const alert = useAlert();
    const db = useDatabase();

    const { onDelete } = props;
    const onSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            // Validate form
            let error = false;
            const sanitizedName = name.trim();
            if (sanitizedName === '') {
                setNameError(true);
                error = true;
            }

            if (gameConsole !== 'NES' && gameConsole !== 'GB' && gameConsole !== 'GBC' && gameConsole !== 'CHIP 8') {
                setGameConsoleError(true);
                error = true;
            }

            if (error) {
                return;
            }

            defaultRomImage.then(defaultImage => {
                const image =
                    imageInput.current?.files?.length !== 0 ? (imageInput.current?.files as FileList)[0] : defaultImage;

                const activeUser = getActiveUserUuid() as string;

                // Add entry to the gameMetaData object store
                const uuid = uuidv4();
                putGameMetaData({
                    name,
                    image,
                    saveNames: ['Save 1'],
                    activeSaveIndex: 0,
                    console: gameConsole,
                    user: activeUser,
                    settings: {
                        hidden: false,
                        deletable: false,
                        imageRendering: 'unset',
                        captureImage: true,
                    },
                    age: 0,
                    uuid,
                }).then(
                    () => message('Rom Added', { title: 'Success', severity: 'SUCCESS' }),
                    error => alert(`${error}`, { title: 'Error', severity: 'ERROR' }),
                );

                // Add entry to the gameData object store
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(props.file);

                fileReader.onload = () => {
                    putGameData(db, {
                        rom: fileReader.result as ArrayBuffer,
                        saves: [
                            {
                                data: new ArrayBuffer(0), // TODO: create a function that determines the required size of saves
                                age: 0,
                                uuid: uuidv4(),
                            },
                        ],
                        user: activeUser,
                        age: 0,
                        uuid,
                    });
                };

                onDelete();
            });
        },
        [name, gameConsole, putGameMetaData, props.file, onDelete, message, alert, db],
    );

    return (
        <form
            onSubmit={onSubmit}
            className={classNames('flex flex-col self-center rounded-4xl w-80 bg-primary-800 p-5', props.className)}
        >
            <div
                ref={backgroundImageDiv}
                className="bg-cover bg-center bg-blend-multiply rounded-3xl bg-primary-900 h-48 mb-3 flex items-center justify-center"
            >
                <label htmlFor={`image-${props.id}`} className="btn-secondary h-10 px-2.5 text-primary-100">
                    <input
                        ref={imageInput}
                        className="hidden"
                        type="file"
                        id={`image-${props.id}`}
                        name={`image-${props.id}`}
                        onChange={onImageChange}
                        accept="image/png, image/jpeg"
                    ></input>
                    Choose Image
                </label>
            </div>
            <div className="flex items-center mb-3.5">
                <label htmlFor={`name-${props.id}`} className="font-semibold mr-auto">
                    Name*
                </label>
                {nameError && <span className="text-sm text-red-500">This Field Is Required</span>}
            </div>
            <input
                className="appearance-none w-full h-11 px-2 mb-5 flex-grow bg-primary-800 ring-2 ring-primary-900 rounded focus:outline-none"
                name={`name-${props.id}`}
                id={`name-${props.id}`}
                type="text"
                value={name}
                onChange={e => setName(e.currentTarget.value)}
            ></input>

            <div className="flex items-center mb-3.5">
                <label htmlFor={`console-${props.id}`} className="font-semibold mr-auto">
                    Console*
                </label>
                {gameConsoleError && <span className="text-sm text-red-500">This Field Is Required</span>}
            </div>
            <select
                className="appearance-none w-full h-11 px-2 mb-5 flex-grow bg-primary-800 ring-2 ring-primary-900 rounded focus:outline-none"
                name={`console-${props.id}`}
                id={`console-${props.id}`}
                value={gameConsole}
                onChange={e => setGameConsole(e.currentTarget.value as Console)}
            >
                <option value="NES">NES</option>
                <option value="GB">Game Boy</option>
                <option value="GBC">Game Boy Color</option>
                <option value="CHIP 8">CHIP 8</option>
            </select>
            <div className="flex mx-auto">
                <label htmlFor={`submit-${props.id}`} className="btn-primary h-7 w-24 mr-10">
                    <input
                        type="submit"
                        name={`submit-${props.id}`}
                        id={`submit-${props.id}`}
                        className="hidden"
                    ></input>
                    <FaPlus className="inline-block mr-1.5" size="10px" />
                    <span className="font-medium">Add</span>
                </label>

                <button
                    className="font-medium text-primary-100 md:hover:text-red-500 active:text-red-500"
                    onClick={props.onDelete}
                    type="button"
                >
                    Delete
                </button>
            </div>
        </form>
    );
}

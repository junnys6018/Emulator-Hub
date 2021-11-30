import React, { useCallback, useRef, useState } from 'react';
import { Console } from '@/src/storage/game-data';
import { FaPlus } from 'react-icons/fa';
import classNames from 'classnames';

interface AddRomFormProps {
    id: number;
    className?: string;
    initialName: string;
    inititalConsole: Console;
    file: File;
    onDelete: () => void;
}

export default function AddRomForm(props: AddRomFormProps) {
    const [name, setName] = useState(props.initialName);
    const [gameConsole, setGameConsole] = useState<Console>(props.inititalConsole);

    const backgroundImageDiv = useRef<HTMLDivElement>(null);
    const backgroundImageUrl: React.MutableRefObject<string | null> = useRef<string>(null);

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

    const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }, []);

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
            <label htmlFor={`name-${props.id}`} className="font-semibold mb-3.5">
                Name*
            </label>
            <input
                className="appearance-none w-full h-11 px-2 mb-5 flex-grow bg-primary-800 ring-2 ring-primary-900 rounded focus:outline-none"
                name={`name-${props.id}`}
                id={`name-${props.id}`}
                type="text"
                value={name}
                onChange={e => setName(e.currentTarget.value)}
            ></input>

            <label htmlFor={`console-${props.id}`} className="font-semibold mb-3.5">
                Console*
            </label>
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
                >
                    Delete
                </button>
            </div>
        </form>
    );
}

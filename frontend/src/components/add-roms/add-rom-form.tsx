import React, { useState } from 'react';
import { Console } from '@/src/storage/game-data';
import { FaPlus } from 'react-icons/fa';
import classNames from 'classnames';

interface AddRomFormProps {
    id: number;
    className?: string;
}

export default function AddRomForm(props: AddRomFormProps) {
    const [name, setName] = useState('');
    const [console, setConsole] = useState<Console>('NES');

    return (
        <div className={classNames('flex flex-col self-center rounded-4xl w-80 bg-primary-800 p-5', props.className)}>
            <div className="rounded-3xl bg-primary-900 h-48 mb-3 flex items-center justify-center">
                <button className="btn-secondary h-10 px-2.5 text-primary-100">Choose Image</button>
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
                value={console}
                onChange={e => setConsole(e.currentTarget.value as Console)}
            >
                <option value="NES">NES</option>
                <option value="GB">Game Boy</option>
                <option value="GBC">Game Boy Color</option>
                <option value="CHIP 8">CHIP 8</option>
            </select>
            <div className="flex mx-auto">
                <button className="btn-primary h-7 w-24 mr-10">
                    <FaPlus className="inline-block mr-1.5" size="10px" />
                    <span className="font-medium">Add</span>
                </button>
                <button className="font-medium text-primary-100 md:hover:text-red-500 active:text-red-500">
                    Delete
                </button>
            </div>
        </div>
    );
}

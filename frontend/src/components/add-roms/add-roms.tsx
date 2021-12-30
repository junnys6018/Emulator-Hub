import React, { Fragment, useCallback, useRef, useState } from 'react';
import Navbar from '../util/navbar';
import AddFileIcon from '@/public/assets/add-file.svg?react';
import TicTacToe from '@/public/assets/tic-tac-toe.svg';

import AddRomForm from './add-rom-form';
import { useUserProfile } from '@/src/storage/user-data';
import { Console } from '@/src/storage/game-data';
import { getExtension, isMobile, stripExtension } from '@/src/util';
import { useAlert } from '../util/alert';
import classNames from 'classnames';

import './add-roms.css';

function consoleForExtension(extension: string | null): Console {
    switch (extension) {
        case 'gb':
            return 'GB';
        case 'gbc':
            return 'GBC';
        case 'nes':
            return 'NES';
        case 'ch8':
        case 'c8':
            return 'CHIP 8';

        default:
            return 'NES';
    }
}

interface FormItem {
    id: number;
    initialName: string;
    initialConsole: Console;
    file: File;
}

export default function AddRoms() {
    const [{ userName, profileImage }] = useUserProfile();
    const [dragging, setDragging] = useState(false);
    const dragCounter = useRef(0);
    const currentId = useRef(0);
    const [forms, setForms] = useState<FormItem[]>([]);

    const mobile = isMobile();

    const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        dragCounter.current++;
        if (dragCounter.current !== 1) {
            return;
        }

        if (e.dataTransfer.types.includes('Files')) {
            setDragging(true);
        }
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        dragCounter.current--;
        if (dragCounter.current !== 0) {
            return;
        }
        setDragging(false);
    }, []);

    // The only purpose of this handler is to prevent the default behaviour of
    // dragOver events, which is to download the dropped file. Why dragOver
    // does anything on a drop event is a mystery...
    const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const alert = useAlert();

    const handleFile = useCallback((file: File) => {
        const initialName = stripExtension(file.name);
        const initialConsole = consoleForExtension(getExtension(file.name));
        setForms(forms => forms.concat({ id: currentId.current++, initialName, initialConsole, file }));
    }, []);

    const onDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();

            dragCounter.current = 0;
            setDragging(false);

            for (let i = 0; i < e.dataTransfer.items.length; i++) {
                const entry = e.dataTransfer.items[i].webkitGetAsEntry();
                if (entry !== null && entry.isFile) {
                    (entry as FileSystemFileEntry).file(
                        file => handleFile(file),
                        error => alert(error.message, { severity: 'ERROR', title: 'error.name' }),
                    );
                }
            }
        },
        [alert, handleFile],
    );

    const onFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.currentTarget.files) {
                for (let i = 0; i < e.currentTarget.files.length; i++) {
                    const file = e.currentTarget.files[i];
                    handleFile(file);
                }
            }
        },
        [handleFile],
    );

    const onDelete = useCallback((id: number) => {
        setForms(forms => forms.filter(item => item.id !== id));
    }, []);

    const submitAll = useCallback(() => {
        const formContainer = document.getElementById('form-container') as HTMLDivElement;
        for (let i = 0; i < formContainer.children.length; i++) {
            const form = formContainer.children[i];
            const event = new SubmitEvent('submit', {
                bubbles: true,
                cancelable: true,
            });
            form.dispatchEvent(event);
        }
    }, []);

    const dropperClassName = `add-roms__dropper ${dragging ? 'border-green-500 text-green-500' : 'border-gray-50'}`;

    const dropperChilren = (
        <Fragment>
            <AddFileIcon className="mb-6 md:transform md:scale-150" />
            <span className="text-2xl md:hidden">Add Roms</span>
            <span className="text-2xl hidden md:inline-block">Drag &amp; Drop Your Roms</span>
        </Fragment>
    );

    return (
        <Fragment>
            <div
                className="bg-gray-800"
                style={{
                    backgroundImage: `url(${TicTacToe})`,
                    backgroundBlendMode: 'multiply',
                    backgroundSize: '128px',
                }}
            >
                <Navbar userName={userName} profileImage={profileImage} />
                <div className="container flex flex-col pt-2.5 md:pt-0">
                    <h2 className="font-semibold text-xl md:text-3xl">Add Roms</h2>
                    {mobile ? (
                        <label htmlFor="dropper-input" className={classNames(dropperClassName, 'cursor-pointer')}>
                            {dropperChilren}
                            <input
                                className="hidden"
                                type="file"
                                multiple
                                id="dropper-input"
                                name="dropper-input"
                                onChange={onFileChange}
                            ></input>
                        </label>
                    ) : (
                        <div
                            onDragEnter={onDragEnter}
                            onDragLeave={onDragLeave}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                            className={dropperClassName}
                        >
                            {dropperChilren}
                        </div>
                    )}
                </div>
            </div>
            <div className="container flex flex-col pt-8 md:pt-16">
                <div className="flex mb-4 md:mb-8">
                    <h2 className="font-semibold text-xl md:text-3xl mr-auto">New Roms</h2>
                    <button
                        onClick={submitAll}
                        className={`btn-primary h-8 md:h-10 px-4 md:px-16 md:text-xl ${
                            forms.length === 0 ? 'disabled' : 'ring-2 md:ring-4 ring-inset ring-green-600'
                        }`}
                    >
                        Add All
                    </button>
                </div>
                <div id="form-container" className="add-roms__forms-container">
                    {forms.map(item => (
                        <AddRomForm
                            className="flex-shrink-0 mb-4 md:mb-0 md:mr-8 md:last:mr-0"
                            id={item.id}
                            key={item.id}
                            initialName={item.initialName}
                            inititalConsole={item.initialConsole}
                            file={item.file}
                            onDelete={() => onDelete(item.id)}
                        />
                    ))}
                </div>
            </div>
        </Fragment>
    );
}

import React, { Fragment, useCallback, useRef, useState } from 'react';
import Navbar from '../util/navbar';
import AddFileIcon from '@/public/assets/add-file.svg';

import AddRomForm from './add-rom-form';
import { useUserProfile } from '@/src/storage/user-data';
import { Console } from '@/src/storage/game-data';
import './add-roms.css';
import { getExtension, stripExtension } from '@/src/util';

function consoleForExtension(extension: string | null) {
    switch (extension) {
        case 'gb':
            return 'GB';
        case 'gbc':
            return 'GBC';
        case 'nes':
            return 'NES';

        default:
            return 'NES';
    }
}

export default function AddRoms() {
    const [{ userName, profileImage }] = useUserProfile();
    const [dragging, setDragging] = useState(false);
    const dragCounter = useRef(0);
    const currentId = useRef(0);
    const [forms, setForms] = useState<{ id: number; initialName: string; initialConsole: Console; file: File }[]>([]);

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

    const onDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter.current = 0;
            setDragging(false);

            for (let i = 0; i < e.dataTransfer.files.length; i++) {
                const file = e.dataTransfer.files[i];

                const initialName = stripExtension(file.name);
                const initialConsole = consoleForExtension(getExtension(file.name));
                forms.push({ id: currentId.current++, initialName, initialConsole, file });
            }
            setForms(forms);
        },
        [forms],
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

    return (
        <Fragment>
            <Navbar userName={userName} profileImage={profileImage} />
            <div className="container flex flex-col pt-2.5 md:pt-0">
                <h1 className="font-semibold text-xl md:text-3xl">Add Roms</h1>
                <div
                    onDragEnter={onDragEnter}
                    onDragLeave={onDragLeave}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    className={`w-60 h-44 md:w-168 md:h-80 self-center rounded-2xl md:rounded-5xl border-4 border-dashed flex flex-col items-center justify-center my-12 ${
                        dragging ? 'border-green-500 text-green-500' : 'border-gray-50'
                    }`}
                >
                    <AddFileIcon className="mb-6 md:transform md:scale-150" />
                    <span className="text-2xl md:hidden">Add Roms</span>
                    <span className="text-2xl hidden md:inline-block">Drag &amp; Drop Your Roms</span>
                </div>
                {forms.length !== 0 && (
                    <div className="flex mb-4 md:mb-8">
                        <h1 className="font-semibold text-xl md:text-3xl mr-auto">New Roms</h1>
                        <button
                            onClick={submitAll}
                            className="btn-primary h-8 md:h-10 px-4 md:px-16 md:text-xl ring-2 md:ring-4 ring-inset ring-green-600"
                        >
                            Add All
                        </button>
                    </div>
                )}
                <div id="form-container" className="add-roms__forms-container">
                    {forms.map(item => (
                        <AddRomForm
                            className="flex-shrink-0 mb-4 md:mr-8 md:last:mr-0"
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

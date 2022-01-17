import React, { Fragment, useEffect, useRef } from 'react';
import { GameMetaDataView } from '@/src/storage/game-data';
import Chip8, { validateChip8Rom } from '@/src/emulators/chip8/chip8';
import { useActiveUserProfile } from '@/src/storage/user-data';
import Canvas from '../canvas';
import { isMobile } from '@/src/util';
import './chip8.css';
import { useMessage } from '../../util/message';
import useCaptureImageEffect from '@/src/emulators/capture-image';

interface Chip8InterfaceProps {
    gameUuid: string;
    rom: ArrayBuffer;
    gameMetaDataView: GameMetaDataView;
}

export default function Chip8Interface(props: Chip8InterfaceProps) {
    const [{ settings }] = useActiveUserProfile();
    const canvasElement = useRef<HTMLCanvasElement>(null);
    const emu = useRef<Chip8 | null>(null);

    const message = useMessage();

    useEffect(() => {
        const romError = validateChip8Rom(new Uint8Array(props.rom));

        if (!romError.ok) {
            message(romError.message, { severity: 'ERROR', title: 'Error' });
            return;
        }

        emu.current = new Chip8(props.rom, canvasElement.current as HTMLCanvasElement, settings.chip8Controls);
        emu.current.start();

        return () => {
            emu.current?.shutdown();
        };
    }, [message, props.rom, settings.chip8Controls]);

    // Screenshot effect
    useCaptureImageEffect(props.gameMetaDataView, emu);

    const mobile = isMobile();

    return (
        <Fragment>
            <Canvas className="chip8__canvas" jsxRef={canvasElement} width={64} height={32} />
            {mobile && (
                <div
                    className="chip8__button-grid"
                    onTouchStart={e => {
                        const target = e.target as HTMLElement;
                        if (target.nodeName == 'BUTTON') {
                            target.classList.add('bg-gray-600');
                            target.classList.remove('bg-gray-700');
                            if (emu.current !== null) {
                                emu.current.setKeyDown(parseInt(target.dataset.button as string));
                            }
                        }
                    }}
                    onTouchEnd={e => {
                        const target = e.target as HTMLElement;
                        if (target.nodeName == 'BUTTON') {
                            target.classList.remove('bg-gray-600');
                            target.classList.add('bg-gray-700');
                            if (emu.current !== null) {
                                emu.current.setKeyUp(parseInt(target.dataset.button as string));
                            }
                        }
                    }}
                >
                    {[1, 2, 3, 12, 4, 5, 6, 13, 7, 8, 9, 14, 10, 0, 11, 15].map(n => (
                        <button key={n} data-button={n}>
                            {n.toString(16).toUpperCase()}
                        </button>
                    ))}
                </div>
            )}
        </Fragment>
    );
}

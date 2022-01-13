import React, { Fragment, useEffect, useRef } from 'react';
import { useDatabase } from '@/src/storage/storage';
import { getGameData } from '@/src/storage/game-data';
import Chip8, { validateChip8Rom } from '@/src/emulators/chip8/chip8';
import { useUserProfile } from '@/src/storage/user-data';
import Canvas from '../canvas';
import { useBreakpoint } from '@/src/use-breakpoint';
import { Breakpoints } from '@/breakpoints';
import { isMobile } from '@/src/util';
import './chip8.css';
import { useAlert } from '../../util/alert';

interface Chip8InterfaceProps {
    gameUuid: string;
}

function getWidth(breakpoint: Breakpoints<boolean>) {
    if (breakpoint.xl) {
        return 1000;
    } else if (breakpoint.lg) {
        return 992;
    } else if (breakpoint.md) {
        return 768;
    } else {
        return '100%';
    }
}

export default function Chip8Interface(props: Chip8InterfaceProps) {
    const db = useDatabase();
    const [{ settings }] = useUserProfile();
    const canvasElement = useRef<HTMLCanvasElement>(null);
    const emu = useRef<Chip8 | null>(null);

    const alert = useAlert();

    useEffect(() => {
        getGameData(db, props.gameUuid).then(gameData => {
            if (gameData) {
                const romError = validateChip8Rom(new Uint8Array(gameData.rom));

                if (romError.ok) {
                    emu.current = new Chip8(
                        gameData.rom,
                        canvasElement.current as HTMLCanvasElement,
                        settings.chip8Controls,
                    );
                    emu.current.start();
                } else {
                    alert(romError.message, { severity: 'ERROR', title: 'Error' });
                }
            }
        });
        return () => {
            emu.current?.shutdown();
        };
    }, [alert, db, props.gameUuid, settings.chip8Controls]);

    const breakpoint = useBreakpoint();
    const mobile = isMobile();

    return (
        <Fragment>
            <Canvas
                className="mx-auto md:my-12"
                jsxRef={canvasElement}
                width={64}
                height={32}
                style={{ width: getWidth(breakpoint), aspectRatio: '2/1' }}
            />
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
                                emu.current.setKeyup(parseInt(target.dataset.button as string));
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

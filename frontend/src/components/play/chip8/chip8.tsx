import React, { Fragment, useEffect, useRef } from 'react';
import { useDatabase } from '@/src/storage/storage';
import { getGameData } from '@/src/storage/game-data';
import Chip8 from '@/src/emulators/chip8/chip8';
import { useUserProfile } from '@/src/storage/user-data';
import Canvas from '../canvas';

interface Chip8InterfaceProps {
    gameUuid: string;
}

export default function Chip8Interface(props: Chip8InterfaceProps) {
    const db = useDatabase();
    const [{ settings }] = useUserProfile();
    const canvasElement = useRef<HTMLCanvasElement>(null);
    const emu = useRef<Chip8 | null>(null);

    useEffect(() => {
        getGameData(db, props.gameUuid).then(gameData => {
            if (gameData) {
                emu.current = new Chip8(
                    gameData.rom,
                    canvasElement.current as HTMLCanvasElement,
                    settings.chip8Controls,
                );
                emu.current.start();
            }
        });
        return () => {
            emu.current?.shutdown();
        };
    }, [db, props.gameUuid, settings.chip8Controls]);

    return (
        <Fragment>
            <div className="mx-auto my-12 relative" style={{ width: 1000, aspectRatio: '2/1' }}>
                <Canvas jsxRef={canvasElement} width={64} height={32} />
            </div>
        </Fragment>
    );
}

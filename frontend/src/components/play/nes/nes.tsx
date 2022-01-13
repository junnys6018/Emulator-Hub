import React, { Fragment, useEffect, useRef } from 'react';
import { useDatabase } from '@/src/storage/storage';
import { getGameData } from '@/src/storage/game-data';
import NES from '@/src/emulators/nes/nes';
import { useUserProfile } from '@/src/storage/user-data';
import Canvas from '../canvas';
import { useBreakpoint } from '@/src/use-breakpoint';
import { Breakpoints } from '@/breakpoints';

interface NESInterfaceProps {
    gameUuid: string;
}

function getWidth(breakpoint: Breakpoints<boolean>) {
    if (breakpoint.xl) {
        return 700;
    } else if (breakpoint.lg) {
        return 600;
    } else if (breakpoint.md) {
        return 500;
    } else {
        return '100%';
    }
}

export default function NesInterface(props: NESInterfaceProps) {
    const db = useDatabase();
    const [{ settings }] = useUserProfile();
    const canvasElement = useRef<HTMLCanvasElement>(null);
    const emu = useRef<NES | null>(null);

    useEffect(() => {
        getGameData(db, props.gameUuid).then(gameData => {
            if (gameData) {
                emu.current = new NES(gameData.rom, canvasElement.current as HTMLCanvasElement, settings.nesControls);
                emu.current.start();
            }
        });
        return () => {
            emu.current?.shutdown();
        };
    }, [db, props.gameUuid, settings.nesControls]);

    const breakpoint = useBreakpoint();

    return (
        <Fragment>
            <Canvas
                className="mx-auto md:mb-6"
                jsxRef={canvasElement}
                width={256}
                height={240}
                style={{ width: getWidth(breakpoint), aspectRatio: '256/240' }}
            />
        </Fragment>
    );
}

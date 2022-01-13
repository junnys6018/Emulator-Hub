import React, { Fragment, useCallback, useEffect, useRef } from 'react';
import { useDatabase } from '@/src/storage/storage';
import { getGameData, updateSave, useGameMetaData } from '@/src/storage/game-data';
import NES, { validateNesRom } from '@/src/emulators/nes/nes';
import { useUserProfile } from '@/src/storage/user-data';
import Canvas from '../canvas';
import { useBreakpoint } from '@/src/use-breakpoint';
import { Breakpoints } from '@/breakpoints';
import { useMessage } from '../../util/message';

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

    const message = useMessage();
    const [gameMetaData] = useGameMetaData();
    const saveIndex = gameMetaData.find(item => item.uuid === props.gameUuid)?.activeSaveIndex;

    useEffect(() => {
        getGameData(db, props.gameUuid).then(gameData => {
            if (gameData) {
                const romError = validateNesRom(new Uint8Array(gameData.rom));

                if (romError.ok) {
                    emu.current = new NES(
                        gameData.rom,
                        gameData.saves[saveIndex as number].data,
                        canvasElement.current as HTMLCanvasElement,
                        settings.nesControls,
                    );
                    emu.current.start();
                } else {
                    message(romError.message, { severity: 'ERROR', title: 'Error' });
                }
            }
        });
        return () => {
            emu.current?.shutdown();
        };
    }, [message, db, props.gameUuid, settings.nesControls, gameMetaData, saveIndex]);

    const commitSave = useCallback(() => {
        if (emu.current !== null) {
            const save = emu.current.getSave();
            if (save !== null) {
                updateSave(db, props.gameUuid, saveIndex as number, save);
            }
        }
    }, [db, props.gameUuid, saveIndex]);

    useEffect(() => {
        const timerId = setInterval(commitSave, 2000);
        return () => {
            clearInterval(timerId);
        };
    }, [commitSave]);

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

import React, { Fragment, useEffect, useRef } from 'react';
import { useDatabase } from '@/src/storage/storage';
import { getGameData, useGameMetaData } from '@/src/storage/game-data';
import NES, { validateNesRom } from '@/src/emulators/nes/nes';
import { useUserProfile } from '@/src/storage/user-data';
import Canvas from '../canvas';
import { useMessage } from '../../util/message';
import useCaptureImageEffect from '@/src/emulators/capture-image';
import useAutoSaveEffect from '@/src/emulators/auto-save';
import './nes.css';

interface NESInterfaceProps {
    gameUuid: string;
}

export default function NesInterface(props: NESInterfaceProps) {
    const db = useDatabase();
    const [{ settings }] = useUserProfile();
    const canvasElement = useRef<HTMLCanvasElement>(null);
    const emu = useRef<NES | null>(null);

    const message = useMessage();
    const [gameMetaData] = useGameMetaData();

    const gameMetaDataView = gameMetaData.find(item => item.uuid === props.gameUuid);

    /**
     * FIXME: If this page is refreshed, the settings from useUserProfile will be changed when it is loaded, causing
     * this component to re-render and this effect hook to be run. Due to a race condition in the .then, the first
     * emulator is not properly shutdown before the new instance is started, causing 2 instances of the emulator to be
     * running. As a result when this component is torn down, only the 'fresh' instance of the emulator is shutdown
     * resulting in the old instance of the emulator running in the background
     */
    useEffect(() => {
        if (gameMetaDataView === undefined) {
            return;
        }
        getGameData(db, props.gameUuid).then(gameData => {
            if (gameData === undefined) {
                return;
            }

            const romError = validateNesRom(new Uint8Array(gameData.rom));

            if (!romError.ok) {
                message(romError.message, { severity: 'ERROR', title: 'Error' });
                return;
            }
            emu.current = new NES(
                gameData.rom,
                gameData.saves[gameMetaDataView.activeSaveIndex].data,
                canvasElement.current as HTMLCanvasElement,
                settings.nesControls,
            );
            emu.current.start();
        });
        return () => {
            emu.current?.shutdown();
        };
    }, [message, db, props.gameUuid, settings.nesControls, gameMetaDataView]);

    // Screenshot Effect
    useCaptureImageEffect(gameMetaDataView, emu);

    // Auto Save
    useAutoSaveEffect(emu, props.gameUuid, gameMetaDataView?.activeSaveIndex);

    return (
        <Fragment>
            <Canvas className="nes__canvas" jsxRef={canvasElement} width={256} height={240} />
        </Fragment>
    );
}

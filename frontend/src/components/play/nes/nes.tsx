import React, { Fragment, useEffect, useRef } from 'react';
import { GameMetaDataView } from '@/src/storage/game-data';
import NES, { validateNesRom } from '@/src/emulators/nes/nes';
import { useActiveUserProfile } from '@/src/storage/user-data';
import Canvas from '../canvas';
import { useMessage } from '../../util/message';
import useCaptureImageEffect from '@/src/emulators/capture-image';
import useAutoSaveEffect from '@/src/emulators/auto-save';
import './nes.css';

interface NESInterfaceProps {
    gameUuid: string;
    rom: ArrayBuffer;
    save: ArrayBuffer | null;
    gameMetaDataView: GameMetaDataView;
}

export default function NesInterface(props: NESInterfaceProps) {
    const [{ settings }] = useActiveUserProfile();
    const canvasElement = useRef<HTMLCanvasElement>(null);
    const emu = useRef<NES | null>(null);

    const message = useMessage();

    useEffect(() => {
        const romError = validateNesRom(new Uint8Array(props.rom));

        if (!romError.ok) {
            message(romError.message, { severity: 'ERROR', title: 'Error' });
            return;
        }

        emu.current = new NES(props.rom, props.save, canvasElement.current as HTMLCanvasElement, settings.nesControls);
        emu.current.start();

        return () => {
            emu.current?.shutdown();
        };
    }, [message, props.rom, props.save, settings.nesControls]);

    // Screenshot Effect
    useCaptureImageEffect(props.gameMetaDataView, emu);

    // Auto Save
    useAutoSaveEffect(emu, props.gameUuid, props.gameMetaDataView.activeSaveIndex);

    return (
        <Fragment>
            <Canvas className="nes__canvas" jsxRef={canvasElement} width={256} height={240} />
        </Fragment>
    );
}

import { useEffect } from 'react';
import { useMessage } from '../components/util/message';
import { GameMetaDataView, useGameMetaData } from '../storage/game-data';
import { imageDataToBlob } from '../util';
import { Emulator } from './emulator';

export default function useCaptureImageEffect(
    gameMetaDataView: GameMetaDataView | undefined,
    emu: React.MutableRefObject<Emulator | null>,
) {
    const [, putGameMetaData] = useGameMetaData();
    const message = useMessage();

    useEffect(() => {
        if (gameMetaDataView === undefined || !gameMetaDataView.settings.captureImage) {
            return;
        }

        const timeoutID = setTimeout(async () => {
            const screenshot = emu.current?.screenshot();
            if (screenshot === null || screenshot === undefined) {
                return;
            }

            const blob = await imageDataToBlob(screenshot);

            if (blob === null) {
                return;
            }

            putGameMetaData({
                image: blob,
                settings: {
                    imageRendering: 'pixelated',
                    captureImage: false,
                },
                uuid: gameMetaDataView.uuid,
            });
        }, 10000) as unknown as number;

        return () => {
            clearTimeout(timeoutID);
        };
    }, [gameMetaDataView, message, gameMetaDataView?.uuid, putGameMetaData, emu]);
}

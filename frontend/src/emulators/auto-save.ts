import { useCallback, useEffect } from 'react';
import { updateSave } from '../storage/game-data';
import { useDatabase } from '../storage/storage';
import { Emulator } from './emulator';

export default function useAutoSaveEffect(
    emu: React.MutableRefObject<Emulator | null>,
    uuid: string,
    index: number | undefined,
) {
    const db = useDatabase();

    const commitSave = useCallback(() => {
        if (emu.current !== null && index !== undefined) {
            const save = emu.current.getSave();
            if (save !== null) {
                updateSave(db, uuid, index, save);
            }
        }
    }, [db, emu, index, uuid]);

    useEffect(() => {
        const timerId = setInterval(commitSave, 2000);
        return () => {
            clearInterval(timerId);
        };
    }, [commitSave]);
}

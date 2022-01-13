import { Console } from '../storage/game-data';
import { getMapperNumber } from './nes/nes';

/**
 * Given a rom for a console, returns an appropratly sized ArrayBuffer to store the save data,
 * or null if the rom does not support saves
 * @param rom
 * @param console
 */
export default function createSave(rom: Uint8Array, console: Console): ArrayBuffer | null {
    if (console !== 'NES') {
        return null;
    }

    const mapperNumber = getMapperNumber(rom);
    if (mapperNumber === 1 || mapperNumber === 4) {
        return new ArrayBuffer(8 * 1024);
    }
    return null;
}

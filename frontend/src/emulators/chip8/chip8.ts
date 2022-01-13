import RomError from '../rom-error';
import chip8Module from './chip8-module';
import Go from './wasm-exec';

export interface Chip8Export {
    malloc(size: number): number;
    free(pointer: number): void;

    InitChip8(offset: number, size: number): number;
    Step(): void;
    SetKeys(keys: number): void;
    GetFrame(): number;

    memory: WebAssembly.Memory;
}

export function validateChip8Rom(rom: Uint8Array): RomError {
    if (rom.byteLength > 3584) {
        return new RomError('File too large');
    }

    return new RomError({ ok: true });
}

export default class Chip8 {
    _keys: number;
    _controls: string[];
    _previousTimestamp: number | null;
    _totalTime: number;
    _RAFRequestID: number | null;
    _context: CanvasRenderingContext2D;
    _chip8: Chip8Export | null;

    constructor(rom: ArrayBuffer, mount: HTMLCanvasElement, controls: string[]) {
        this._keys = 0;
        this._controls = controls;
        this._previousTimestamp = null;
        this._totalTime = 0;
        this._RAFRequestID = null;
        this._context = mount.getContext('2d') as CanvasRenderingContext2D;
        this._chip8 = null;

        const go = new Go();

        chip8Module.then(module => {
            WebAssembly.instantiate(module, go.importObject).then(instance => {
                go.run(instance);

                const exports = instance.exports as unknown as Chip8Export;
                const InitChip8 = instance.exports.InitChip8 as (
                    offset: number,
                    size: number,
                    capacity: number,
                ) => number;

                /**
                 * InitChip8 takes in a slice of uint8. Slices in go consist of a pointer to the
                 * managed memory, a size and a capacity. In our case the size of the slice will be
                 * always equal to its capacity.
                 */
                Object.defineProperty(exports, 'InitChip8', function (offset: number, size: number) {
                    return InitChip8(offset, size, size);
                });

                this._chip8 = exports;

                const pointer = this._chip8.malloc(rom.byteLength);

                // Load rom into wasm memory
                new Uint8Array(this._chip8.memory.buffer, pointer).set(new Uint8Array(rom));

                this._chip8.InitChip8(pointer, rom.byteLength);

                // Free memory
                this._chip8.free(pointer);
            });
        });

        // Attach Event Listeners
        this._onKeyUp = this._onKeyUp.bind(this);
        window.addEventListener('keyup', this._onKeyUp);
        this._onKeyDown = this._onKeyDown.bind(this);
        window.addEventListener('keydown', this._onKeyDown);
        this._RAFCallback = this._RAFCallback.bind(this);
    }

    start() {
        this._RAFRequestID = requestAnimationFrame(this._RAFCallback);
    }

    shutdown() {
        window.removeEventListener('keyup', this._onKeyUp);
        window.removeEventListener('keydown', this._onKeyDown);

        if (this._RAFRequestID !== null) {
            cancelAnimationFrame(this._RAFRequestID);
        }
    }

    setKeyup(key: number) {
        this._keys &= ~(1 << key);
    }

    setKeyDown(key: number) {
        this._keys |= 1 << key;
    }

    _onKeyUp(e: KeyboardEvent) {
        if (this._controls.includes(e.code)) {
            const key = this._controls.indexOf(e.code);
            this.setKeyup(key);
        }
    }

    _onKeyDown(e: KeyboardEvent) {
        if (this._controls.includes(e.code)) {
            const key = this._controls.indexOf(e.code);
            this.setKeyDown(key);
        }
    }

    _RAFCallback(timestamp: DOMHighResTimeStamp) {
        this._RAFRequestID = requestAnimationFrame(this._RAFCallback);
        if (this._chip8 !== null) {
            this._chip8.SetKeys(this._keys);

            const deltaTime = timestamp - (this._previousTimestamp ?? timestamp);
            this._previousTimestamp = timestamp;
            this._totalTime += deltaTime;

            // step at 500Hz
            while (this._totalTime > 2) {
                this._chip8.Step();
                this._totalTime -= 2;
            }

            // Render to screen
            const imagePointer = this._chip8.GetFrame();
            const image = new Uint8ClampedArray(this._chip8.memory.buffer, imagePointer, 64 * 32 * 4);
            const imageData = new ImageData(image, 64, 32);
            this._context.putImageData(imageData, 0, 0);
        }
    }
}

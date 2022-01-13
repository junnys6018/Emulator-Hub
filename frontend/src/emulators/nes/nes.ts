import { controllerIndex } from '@/src/gamepad';
import { GamepadControls } from '@/src/storage/user-data';
import { NESModule } from './emu';
import nesModule from './nes-module';
import RomError from '../rom-error';

const PPU_CLOCK_FREQENCY = 5369318;
const EVENT_NEW_FRAME = 1;
const EVENT_AUDIO_BUFFER_FULL = 2;
const EVENT_UNTIL_TICKS = 4;

export interface NESExport {
    initialize: () => null;
    createNes: (rom: number, romsize: number, save: number, savesize: number) => number;
    freeNes: (nes: number) => null;
    write_save: (nes: number) => number;
    createBuffer: (size: number) => number;
    freeBuffer: (buffer: number) => null;
    emulateUntil: (nes: number, clock: bigint) => number;
    getTotalCycles: (nes: number) => bigint;
    getFrameBuffer: (nes: number) => number;
    setKeys: (nes: number, keys: number) => null;
    getAudioBuffer: () => number;
    flushAudioSamples: (nes: number) => number;
}

export function getMapperNumber(rom: Uint8Array): number {
    return (rom[6] >> 4) | (rom[7] & 0xf0) | ((rom[8] & 0xf) << 8);
}

export function validateNesRom(rom: Uint8Array): RomError {
    if (
        rom[0] !== 'N'.charCodeAt(0) ||
        rom[1] !== 'E'.charCodeAt(0) ||
        rom[2] !== 'S'.charCodeAt(0) ||
        rom[3] !== 0x1a
    ) {
        return new RomError('Invalid header');
    }

    const mapperNumber = getMapperNumber(rom);
    if (!(mapperNumber >= 0 && mapperNumber <= 4)) {
        return new RomError(`Emulator cannot handle mapper number ${mapperNumber}`);
    }

    const trainer = (rom[6] & 4) !== 0;

    const prgRomBanks = rom[4] | ((rom[9] & 0xf) << 8);
    const chrRomBanks = rom[5] | ((rom[9] & 0xf0) << 4);

    if ((rom[9] & 0xf) === 0xf || (rom[9] & 0xf0) === 0xf0) {
        return new RomError('Exponential rom header size, emulator cannot handle file');
    }

    const expectedSize = 16 + (trainer ? 512 : 0) + prgRomBanks * 16 * 1024 + chrRomBanks * 8 * 1024;
    if (rom.byteLength != expectedSize) {
        return new RomError('Bad filesize');
    }

    return new RomError({ ok: true });
}

export default class NES {
    _keys: number;
    _keyboardControls: { [key: string]: number };
    _gamepadControls: number[];
    _previousTimestamp: number | null;
    _RAFRequestID: number | null;
    _api: NESExport | null;
    _nes: number | null;
    _instance: NESModule;
    _canvasContext: CanvasRenderingContext2D;
    _audioContext: AudioContext;
    _startTime: number;
    _saveSize: number | null;

    constructor(rom: ArrayBuffer, save: ArrayBuffer | null, mount: HTMLCanvasElement, controls: GamepadControls) {
        this._keys = 0;

        this._keyboardControls = {
            [controls.a[0]]: 0,
            [controls.b[0]]: 1,
            [controls.start[0]]: 2,
            [controls.select[0]]: 3,
            [controls.up[0]]: 4,
            [controls.down[0]]: 5,
            [controls.left[0]]: 6,
            [controls.right[0]]: 7,
        };

        this._gamepadControls = [
            controls.a[1],
            controls.b[1],
            controls.start[1],
            controls.select[1],
            controls.up[1],
            controls.down[1],
            controls.left[1],
            controls.right[1],
        ];

        this._previousTimestamp = null;
        this._RAFRequestID = null;
        this._api = null;
        this._nes = null;

        this._canvasContext = mount.getContext('2d') as CanvasRenderingContext2D;
        this._audioContext = new AudioContext();
        this._startTime = this._audioContext.currentTime;

        this._saveSize = null;
        if (save !== null) {
            this._saveSize = save.byteLength;
        }

        nesModule.then(instance => {
            this._instance = instance;

            this._api = {
                initialize: instance.cwrap('initialize', null, []),
                createNes: instance.cwrap('create_nes', 'number', ['number', 'number', 'number', 'number']),
                freeNes: instance.cwrap('free_nes', null, ['number']),
                write_save: instance.cwrap('write_save', 'number', ['number']),
                createBuffer: instance.cwrap('create_buffer', 'number', ['number']),
                freeBuffer: instance.cwrap('free_buffer', null, ['number']),
                emulateUntil: instance.cwrap('emulate_until', 'number', ['number', 'number']) as unknown as (
                    nes: number,
                    clock: bigint,
                ) => number,
                getTotalCycles: instance.cwrap('get_total_cycles', 'number', ['number']) as unknown as (
                    nes: number,
                ) => bigint,
                getFrameBuffer: instance.cwrap('get_framebuffer_wasm', 'number', ['number']),
                setKeys: instance.cwrap('set_keys', null, ['number', 'number']),
                getAudioBuffer: instance.cwrap('get_audio_buffer', 'number', ['number']),
                flushAudioSamples: instance.cwrap('flush_audio_samples', 'number', ['number']),
            };

            this._api.initialize();

            const romSize = rom.byteLength;
            const romBuffer = this._api.createBuffer(romSize);
            const romView = new Uint8Array(instance.HEAPU8.buffer, romBuffer, romSize);
            romView.set(new Uint8Array(rom));

            if (save === null) {
                this._nes = this._api.createNes(romBuffer, romSize, 0, 0);
            } else {
                const saveSize = save.byteLength;
                const saveBuffer = this._api.createBuffer(saveSize);
                const saveView = new Uint8Array(instance.HEAPU8.buffer, saveBuffer, saveSize);
                saveView.set(new Uint8Array(save));

                this._nes = this._api.createNes(romBuffer, romSize, saveBuffer, saveSize);

                this._api.freeBuffer(saveBuffer);
            }

            this._api.freeBuffer(romBuffer);
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

        if (this._api !== null && this._nes !== null) {
            this._api.freeNes(this._nes);
        }

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

    getSave(): ArrayBuffer | null {
        if (this._api !== null && this._nes !== null && this._saveSize !== null) {
            const saveBuffer = this._api.write_save(this._nes);
            const save = new ArrayBuffer(this._saveSize);

            new Uint8Array(save).set(new Uint8Array(this._instance.HEAPU8.buffer, saveBuffer, this._saveSize));

            return save;
        }
        return null;
    }

    _onKeyUp(e: KeyboardEvent) {
        if (e.code in this._keyboardControls) {
            e.preventDefault();

            const key = this._keyboardControls[e.code];
            this.setKeyup(key);
        }
    }

    _onKeyDown(e: KeyboardEvent) {
        // TODO: find a better way to start the audio context
        if (this._audioContext.state === 'suspended') {
            this._audioContext.resume();
        }

        if (e.code in this._keyboardControls) {
            e.preventDefault();

            const key = this._keyboardControls[e.code];
            this.setKeyDown(key);
        }
    }

    _emulateUntil(cycle: bigint) {
        if (this._api === null || this._nes === null) {
            return;
        }

        while (true) {
            const event = this._api.emulateUntil(this._nes, cycle);

            if (event & EVENT_NEW_FRAME) {
                const pixelPtr = this._api.getFrameBuffer(this._nes);
                const pixelView = new Uint8ClampedArray(this._instance.HEAPU8.buffer, pixelPtr, 240 * 256 * 4);
                const pixelData = new ImageData(pixelView, 256, 240);
                this._canvasContext.putImageData(pixelData, 0, 0);
            }

            if (event & EVENT_AUDIO_BUFFER_FULL) {
                const numSamples = this._api.flushAudioSamples(this._nes);

                if (numSamples !== 0 && this._audioContext.state === 'running') {
                    const audioBufPtr = this._api.getAudioBuffer();
                    const samples = new Float32Array(this._instance.HEAPF32.buffer, audioBufPtr, numSamples);
                    const audioBuffer = this._audioContext.createBuffer(1, samples.length, 44100);
                    audioBuffer.copyToChannel(samples, 0);

                    const audioBufferSourceNode = this._audioContext.createBufferSource();
                    audioBufferSourceNode.buffer = audioBuffer;
                    audioBufferSourceNode.connect(this._audioContext.destination);

                    if (this._startTime < this._audioContext.currentTime) {
                        this._startTime = this._audioContext.currentTime + 0.1;
                    }

                    audioBufferSourceNode.start(this._startTime);
                    this._startTime += samples.length / 44100;
                }
            }

            if (event & EVENT_UNTIL_TICKS) {
                break;
            }
        }
    }

    _RAFCallback(timestamp: number) {
        this._RAFRequestID = requestAnimationFrame(this._RAFCallback);
        if (this._api !== null && this._nes !== null) {
            let gamepadKeys = 0;

            if (controllerIndex !== null) {
                const gamepad = navigator.getGamepads()[controllerIndex];
                if (gamepad !== null) {
                    for (let i = 0; i < 8; i++) {
                        if (gamepad.buttons[this._gamepadControls[i]].pressed) {
                            gamepadKeys |= 1 << i;
                        }
                    }
                }
            }

            this._api.setKeys(this._nes, this._keys | gamepadKeys);

            const deltaTime = timestamp - (this._previousTimestamp ?? timestamp);
            const cycles = (Math.min(deltaTime, 100) * PPU_CLOCK_FREQENCY) / 1000;
            if (cycles > 0) {
                this._emulateUntil(this._api.getTotalCycles(this._nes) + BigInt(Math.round(cycles)));
            }
            this._previousTimestamp = timestamp;
        }
    }
}

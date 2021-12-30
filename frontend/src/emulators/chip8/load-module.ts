import chip8WasmUrl from '@/public/wasm/chip8.wasm';

let chip8Module: Promise<WebAssembly.Module> | null = null;

export default function getModule(): Promise<WebAssembly.Module> {
    if (chip8Module === null) {
        chip8Module = WebAssembly.compileStreaming(fetch(chip8WasmUrl));
    }
    return chip8Module;
}

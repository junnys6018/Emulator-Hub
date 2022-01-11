import chip8WasmUrl from '@/public/wasm/chip8.wasm';

const chip8Module = WebAssembly.compileStreaming(fetch(chip8WasmUrl));
export default chip8Module;

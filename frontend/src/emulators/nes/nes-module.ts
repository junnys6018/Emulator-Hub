import Module from './emu';
import nesWasmUrl from '@/public/wasm/nes.wasm';

// Since webpack will change the name and potentially the path of the
// `.wasm` file, we have to provide a `locateFile()` hook to redirect
// to the appropriate URL.
// More details: https://kripken.github.io/emscripten-site/docs/api_reference/module.html
const nesModule = Module({
    locateFile(path) {
        if (path.endsWith('.wasm')) {
            return nesWasmUrl;
        }
        return path;
    },
});

export default nesModule;

export interface NESModule extends EmscriptenModule {
    cwrap: typeof cwrap;
}

declare const Module: EmscriptenModuleFactory<NESModule>;

export default Module;

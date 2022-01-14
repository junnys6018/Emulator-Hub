export abstract class Emulator {
    abstract start(): void;
    abstract shutdown(): void;
    abstract setKeyUp(key: number): void;
    abstract setKeyDown(key: number): void;
    abstract _onKeyUp(e: KeyboardEvent): void;
    abstract _onKeyDown(e: KeyboardEvent): void;
    abstract screenshot(): ImageData | null;
    abstract getSave(): ArrayBuffer | null;
}

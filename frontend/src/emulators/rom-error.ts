export default class RomError extends Error {
    ok: boolean;
    constructor(arg: { ok: boolean } | string | undefined) {
        if (typeof arg === 'string' || arg === undefined) {
            super(arg);
            this.ok = false;
        } else {
            super();
            this.ok = arg.ok;
        }
    }
}

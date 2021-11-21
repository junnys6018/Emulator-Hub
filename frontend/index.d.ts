declare module '*.png';
declare module '*.svg';

// credit to https://stackoverflow.com/questions/41980195/recursive-partialt-in-typescript
type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? RecursivePartial<U>[]
        : T[P] extends object
        ? RecursivePartial<T[P]>
        : T[P];
};

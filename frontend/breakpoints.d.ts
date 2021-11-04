export interface Breakpoints<T> {
    xs: T;
    sm: T;
    md: T;
    lg: T;
    xl: T;
    '2xl': T;
}

export type BreakpointKeys = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

declare const breakpoints: Breakpoints<string>;

export = breakpoints;

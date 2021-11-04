import React, { useState, useEffect, useContext } from 'react';
import breakpoints, { Breakpoints, BreakpointKeys } from '@/breakpoints';

function transformBreakpoint<T, U>(src: Breakpoints<T>, f: (t: T) => U): Breakpoints<U> {
    return {
        xs: f(src.xs),
        sm: f(src.sm),
        md: f(src.md),
        lg: f(src.lg),
        xl: f(src.xl),
        '2xl': f(src['2xl']),
    };
}

const queryLists = transformBreakpoint(breakpoints, size => window.matchMedia(`(min-width: ${size})`));
function matchBreakpoints() {
    return transformBreakpoint(queryLists, queryList => queryList.matches);
}

const BreakpointContext = React.createContext<null | string>(null);

export function BreakpointProvider(props: { children: React.ReactNode }) {
    const [breakpointMatch, setBreakpointMatch] = useState(matchBreakpoints());

    useEffect(() => {
        const handleChange = () => {
            setBreakpointMatch(matchBreakpoints());
        };

        for (const breakpoint in breakpoints) {
            queryLists[breakpoint as BreakpointKeys].addEventListener('change', handleChange);
        }

        // unsubscribe
        return () => {
            for (const breakpoint in breakpoints) {
                queryLists[breakpoint as BreakpointKeys].removeEventListener('change', handleChange);
            }
        };
    }, []);

    const breakpointsInOrder = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    let current = '2xs';
    for (const breakpoint of breakpointsInOrder) {
        if (breakpointMatch[breakpoint as BreakpointKeys]) {
            current = breakpoint;
        } else {
            break;
        }
    }
    return <BreakpointContext.Provider value={current}>{props.children}</BreakpointContext.Provider>;
}

export function useBreakpoint() {
    const breakpoint = useContext(BreakpointContext);
    if (breakpoint === null) {
        throw new Error('useBreakpoint must be used within BreakpointProvider');
    }
    return breakpoint;
}

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}

export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

export function toKebabCase(string: string): string {
    return string
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .toLowerCase();
}

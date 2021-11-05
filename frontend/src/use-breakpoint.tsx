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

const BreakpointContext = React.createContext<Breakpoints<boolean> | null>(null);

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

    return <BreakpointContext.Provider value={breakpointMatch}>{props.children}</BreakpointContext.Provider>;
}

export function getMaxBreakpoint(breakpointMatch: Breakpoints<boolean>) {
    const breakpointsInOrder = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    let max = '2xs';
    for (const breakpoint of breakpointsInOrder) {
        if (breakpointMatch[breakpoint as BreakpointKeys]) {
            max = breakpoint;
        } else {
            break;
        }
    }
    return max;
}

export function useBreakpoint() {
    const breakpoint = useContext(BreakpointContext);
    if (breakpoint === null) {
        throw new Error('useBreakpoint must be used within BreakpointProvider');
    }
    return breakpoint;
}

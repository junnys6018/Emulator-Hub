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

// https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
export function isMobile() {
    let check = false;
    (function (a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                a,
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4),
            )
        )
            check = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })(navigator.userAgent || navigator.vendor || (window as any).opera);
    return check;
}

export function lockBodyScrolling() {
    const body = document.body;
    document.body.style.overflow = 'hidden';

    // Add padding to account for scrollbar disappearing on desktop
    if (body.scrollHeight > window.innerHeight && !isMobile()) {
        document.body.style.paddingRight = '20px';
    }
}

export function unlockBodyScrolling() {
    const body = document.body;
    body.style.overflow = '';
    body.style.paddingRight = '';
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isEmptyObject(obj: Object) {
    return Object.keys(obj).length === 0;
}

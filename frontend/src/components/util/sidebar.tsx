import { lockBodyScrolling, unlockBodyScrolling } from '@/src/util';
import classNames from 'classnames';
import React, { Fragment, useCallback, useEffect, useRef } from 'react';

interface SidebarProps {
    children: (closePanel: () => void) => React.ReactNode;
    className?: string;
    closePanel: () => void;
}

export default function Sidebar(props: SidebarProps) {
    const backdropDiv = useRef<HTMLDivElement>(null);
    const sidePanelDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        lockBodyScrolling();
        (sidePanelDiv.current as HTMLDivElement).classList.replace('translate-x-full', 'translate-x-0');
        (backdropDiv.current as HTMLDivElement).classList.replace('opacity-0', 'opacity-50');
        return () => {
            unlockBodyScrolling();
        };
    }, []);

    const closePanel = useCallback(() => {
        (sidePanelDiv.current as HTMLDivElement).classList.replace('translate-x-0', 'translate-x-full');
        (backdropDiv.current as HTMLDivElement).classList.replace('opacity-50', 'opacity-0');
        (sidePanelDiv.current as HTMLDivElement).addEventListener('transitionend', props.closePanel, { once: true });
    }, [props]);

    return (
        <Fragment>
            <div
                ref={sidePanelDiv}
                className={classNames(
                    'fixed z-30 right-0 top-0 transform transition-transform translate-x-full',
                    props.className,
                )}
            >
                {/* We pass the children as a render prop so that the Sidebar can inject its closePanel handler */}
                {props.children(closePanel)}
            </div>
            <div
                ref={backdropDiv}
                onClick={closePanel}
                className="fixed z-20 top-0 left-0 w-screen h-screen bg-black hover:cursor-pointer
                    transition-opacity ease-linear select-none opacity-0"
            ></div>
        </Fragment>
    );
}

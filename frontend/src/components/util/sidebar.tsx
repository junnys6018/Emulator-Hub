import { lockBodyScrolling, unlockBodyScrolling } from '@/src/util';
import classNames from 'classnames';
import React, { Fragment, useEffect } from 'react';

interface SidebarProps {
    children?: React.ReactNode;
    className?: string;
    show: boolean;
    hide: () => void;
}

export default function Sidebar(props: SidebarProps) {
    useEffect(() => {
        return () => {
            // Cleanup
            unlockBodyScrolling();
        };
    }, []);

    if (props.show) {
        lockBodyScrolling();
    }

    const handleTransition = () => {
        if (!props.show) {
            // unlock the body for scrolling only after the sidebar has exited
            unlockBodyScrolling();
        }
    };

    return (
        <Fragment>
            <div
                className={classNames(
                    `fixed z-50 right-0 top-0 transform transition-transform ${
                        props.show ? 'translate-x-0' : 'translate-x-full'
                    }`,
                    props.className,
                )}
                onTransitionEnd={handleTransition}
            >
                {props.children}
            </div>
            <div
                onClick={props.hide}
                className={`fixed z-40 top-0 left-0 w-screen h-screen bg-black hover:cursor-pointer transition-opacity ease-linear select-none ${
                    props.show ? 'opacity-50' : 'opacity-0 pointer-events-none'
                }`}
            ></div>
        </Fragment>
    );
}

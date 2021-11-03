import { toKebabCase } from '@/src/util';
import React, { Fragment } from 'react';

interface LibraryProps {
    console: string;
    children: React.ReactNode;
}

export default function Library(props: LibraryProps) {
    if (React.Children.count(props.children) === 0) {
        return null;
    }

    return (
        <Fragment>
            <h2 id={toKebabCase(props.console)} className="text-xl mb-4 pt-2.5">
                {props.console}
            </h2>
            <div
                className="
                    mb-6 md:mb-12 grid gap-3 md:gap-9 auto-rows-auto
                    grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                "
            >
                {props.children}
            </div>
        </Fragment>
    );
}

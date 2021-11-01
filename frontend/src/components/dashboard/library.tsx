import React from 'react';

interface LibraryProps {
    console: string;
    children: React.ReactNode;
}

export default function Library(props: LibraryProps) {
    return (
        <div className="container">
            <h2 className="text-xl mb-4 pt-2.5">{props.console}</h2>
            <div className="mb-12 grid gap-9 grid-cols-4 auto-rows-80">{props.children}</div>
        </div>
    );
}

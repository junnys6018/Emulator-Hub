import React from 'react';

export default function UnderConstruction() {
    return (
        <div className="flex-grow flex flex-col justify-center text-center">
            <p className="font-semibold text-6xl md:text-7xl mb-8 md:mb-11">🚧Under Construction🚧</p>
            <p className="font-medium text-gray-300 text-3xl md:text-4xl mb-4 md:mb-5">
                This emulator is still in the works
            </p>
            <p className="font-normal text-gray-300 text-xl md:text-2xl">Come back in a few months :)</p>
        </div>
    );
}

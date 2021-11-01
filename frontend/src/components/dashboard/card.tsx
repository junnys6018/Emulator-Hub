import React from 'react';
import { FaPlay, FaEllipsisH } from 'react-icons/fa';

interface CardProps {
    image: string;
    name: string;
}

export default function Card(props: CardProps) {
    const image: React.CSSProperties = {
        backgroundImage: `url(${props.image})`,
        imageRendering: 'pixelated',
        opacity: 0.8,
        aspectRatio: '1',
    };

    return (
        <div className="flex flex-col">
            <button
                className="select-none flex-grow relative rounded-2xl bg-cover bg-center filter drop-shadow hover:ring-2 hover:ring-green-500"
                style={image}
            ></button>
            <div className="flex items-center mx-3 pt-1">
                <span className="text-sm mr-auto">{props.name}</span>
                <button className="mr-2 hover:text-green-500 p-1">
                    <FaPlay size="12px" />
                </button>
                <button className="hover:text-green-500 p-1">
                    <FaEllipsisH size="12px" />
                </button>
            </div>
        </div>
    );
}

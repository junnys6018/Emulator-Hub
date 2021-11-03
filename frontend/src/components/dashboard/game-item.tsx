import classNames from 'classnames';
import React, { Fragment } from 'react';
import { FaPlay, FaEllipsisH, FaEllipsisV } from 'react-icons/fa';

interface GameItemProps {
    image: string;
    name: string;
    className?: string;
}

export function GameCard(props: GameItemProps) {
    const image: React.CSSProperties = {
        backgroundImage: `url(${props.image})`,
        imageRendering: 'pixelated',
        opacity: 0.8,
        aspectRatio: '1',
    };

    return (
        <div className={classNames('flex flex-col', props.className)}>
            <button
                className="select-none flex-grow rounded-2xl bg-cover bg-center filter drop-shadow hover:ring-2 hover:ring-green-500"
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

export function GameListItem(props: GameItemProps) {
    const image: React.CSSProperties = {
        backgroundImage: `url(${props.image})`,
        imageRendering: 'pixelated',
        opacity: 0.8,
        width: '80px',
        height: '80px',
    };
    return (
        <div className={classNames('flex items-center', props.className)}>
            <button className="flex-shrink-0 rounded bg-cover bg-center mr-4" style={image}></button>
            <span className="mr-auto truncate">{props.name}</span>
            <button className="ml-2 hover:text-green-500">
                <FaEllipsisV />
            </button>
        </div>
    );
}

export default function GameItem(props: { image: string; name: string }) {
    return (
        <Fragment>
            <GameListItem {...props} className="md:hidden" />
            <GameCard {...props} className="hidden md:flex" />
        </Fragment>
    );
}

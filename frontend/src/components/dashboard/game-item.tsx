import { Console } from '@/src/storage/game-data';
import classNames from 'classnames';
import React, { Fragment } from 'react';
import { FaPlay, FaEllipsisH, FaEllipsisV } from 'react-icons/fa';
import { Link, useHistory } from 'react-router-dom';

export interface GameItemProps {
    image: string;
    imageRendering: 'pixelated' | 'unset';
    name: string;
    gameUuid: string;
    console: Console;
    onActiveCallback: () => void;
}

type GameItemInnerProps = GameItemProps & { className?: string };

export function GameCard(props: GameItemInnerProps) {
    const image: React.CSSProperties = {
        backgroundImage: `url(${props.image})`,
        imageRendering: props.imageRendering,
        aspectRatio: '1',
    };

    const history = useHistory();

    return (
        <div className={classNames('flex flex-col', props.className)}>
            <button
                className="select-none flex-grow rounded-2xl bg-cover bg-center filter drop-shadow hover:ring-2 hover:ring-green-500"
                style={image}
                onDoubleClick={() => history.push(`/play/${props.console}?game=${props.gameUuid}`)}
            ></button>
            <div className="flex items-center mx-3 pt-1">
                <span className="text-sm mr-auto">{props.name}</span>
                <Link to={`/play/${props.console}?game=${props.gameUuid}`} className="mr-2 hover:text-green-500 p-1">
                    <FaPlay size="0.75rem" />
                </Link>
                <button className="hover:text-green-500 p-1" onClick={props.onActiveCallback}>
                    <FaEllipsisH size="0.75rem" />
                </button>
            </div>
        </div>
    );
}

export function GameListItem(props: GameItemInnerProps) {
    const image: React.CSSProperties = {
        backgroundImage: `url(${props.image})`,
        imageRendering: props.imageRendering,
        width: '80px',
        height: '80px',
    };

    const history = useHistory();

    return (
        <div className={classNames('flex items-center', props.className)}>
            <button
                className="flex-shrink-0 rounded bg-cover bg-center mr-4"
                style={image}
                onClick={() => history.push(`/play/${props.console}?game=${props.gameUuid}`)}
            ></button>
            <Link to={`/play/${props.console}?game=${props.gameUuid}`} className="mr-auto truncate">
                {props.name}
            </Link>
            <button className="ml-2 active:text-green-500" onClick={props.onActiveCallback}>
                <FaEllipsisV />
            </button>
        </div>
    );
}

export default function GameItem(props: GameItemProps) {
    return (
        <Fragment>
            <GameListItem {...props} className="md:hidden" />
            <GameCard {...props} className="hidden md:flex" />
        </Fragment>
    );
}

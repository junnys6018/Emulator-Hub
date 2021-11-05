import React, { Fragment, useState } from 'react';

import GameItem from './game-item';
import Navbar from './navbar';
import Library from './library';
import GameSidePanel from './game-side-panel';
import Sidebar from '../util/sidebar';

import profile from '@/public/assets/test-profile.png';
import { isEmptyObject, useBreakpoint } from '@/src/util';
import { useGameMetaData, GameMetaData, Console } from '@/src/game-data';

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidePanelOpen, setSidePanelOpen] = useState(false);
    const [activeGame, setActiveGame] = useState<GameMetaData | Record<string, never>>({});

    let gameMetaData = useGameMetaData();
    const breakpoint = useBreakpoint();

    let noneFound = false;
    // Only apply search on mobile
    if (searchQuery !== '' && !breakpoint.md) {
        gameMetaData = gameMetaData.filter(game => game.name.toLowerCase().includes(searchQuery.toLowerCase()));
        noneFound = gameMetaData.length === 0;
    }

    const filterForConsole = (console: Console) => {
        return gameMetaData
            .filter(game => game.console == console)
            .map(game => (
                <GameItem
                    key={game.name}
                    image={game.image}
                    name={game.name}
                    onActiveCallback={() => {
                        setSidePanelOpen(true);
                        setActiveGame(game);
                    }}
                ></GameItem>
            ));
    };

    const closePanel = () => {
        setSidePanelOpen(false);
    };

    return (
        <Fragment>
            <Navbar
                userName="Jun Lim"
                profileImage={profile}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <div className="container">
                <Library console="Nintendo Entertainment System">{filterForConsole('NES')}</Library>
                <Library console="Game Boy">{filterForConsole('GB')}</Library>
                <Library console="Game Boy Color">{filterForConsole('GBC')}</Library>
                <Library console="CHIP 8">{filterForConsole('CHIP 8')}</Library>
                {noneFound && (
                    <p className="text-lg font-medium mt-10 mb-32 break-words text-center">
                        Couldn&apos;t find &quot;{searchQuery}&quot;
                    </p>
                )}
            </div>
            <Sidebar show={sidePanelOpen} hide={closePanel} className="w-screen lg:w-168 h-screen flex flex-col">
                {!isEmptyObject(activeGame) && (
                    <GameSidePanel {...(activeGame as GameMetaData)} closePanel={closePanel} />
                )}
            </Sidebar>
        </Fragment>
    );
}

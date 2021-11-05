import React, { Fragment, useState } from 'react';

import GameItem from './game-item';
import Navbar from './navbar';
import Library from './library';
import GameSidePanel from './game-side-panel';

import profile from '@/public/assets/test-profile.png';
import { useBreakpoint } from '@/src/util';
import { useGameMetaData, GameMetaData, Console } from '@/src/game-data';

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidePanelOpen, setSidePanelOpen] = useState(false);
    let gameMetaData = useGameMetaData();
    const [activeGame, setActiveGame] = useState<GameMetaData | Record<string, never>>({});
    const breakpoint = useBreakpoint();

    let noneFound = false;
    if (searchQuery !== '' && !breakpoint.md) {
        gameMetaData = gameMetaData.filter(game => game.name.toLowerCase().includes(searchQuery.toLowerCase()));
        noneFound = gameMetaData.length === 0;
    }

    // If the side panel is open and the breakpoint changes, we need to lock/unlock the scroll lock on the body
    if (sidePanelOpen) {
        if (breakpoint.lg) {
            document.body.classList.remove('overflow-hidden');
        } else {
            document.body.classList.add('overflow-hidden');
        }
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
                        // Lock scrolling on mobile
                        if (!breakpoint.lg) {
                            document.body.classList.add('overflow-hidden');
                        }
                        setSidePanelOpen(true);
                        setActiveGame(game);
                    }}
                ></GameItem>
            ));
    };

    const closePanel = () => {
        document.body.classList.remove('overflow-hidden');
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
            <GameSidePanel
                {...activeGame}
                closePanel={closePanel}
                className={`fixed z-10 left-0 top-0 w-screen lg:max-w-2xl h-screen transform transition-transform ${
                    sidePanelOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            />
        </Fragment>
    );
}

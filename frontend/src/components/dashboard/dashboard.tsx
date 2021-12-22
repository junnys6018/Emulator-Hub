import React, { Fragment, useState } from 'react';

import GameItem from './game-item';
import Navbar from './navbar';
import Library from './library';
import GameSidePanel from './game-side-panel';
import Sidebar from '../util/sidebar';

import { useBreakpoint } from '@/src/use-breakpoint';
import { useGameMetaData, Console, GameMetaDataView } from '@/src/storage/game-data';
import { useUserProfile } from '@/src/storage/user-data';

// TODO: sort games
export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidePanelGame, setSidePanelGame] = useState<GameMetaDataView | null>(null);
    const [
        {
            userName,
            profileImage,
            settings: {
                general: { showHiddenGames },
            },
        },
    ] = useUserProfile();

    let [gameMetaData] = useGameMetaData();
    const breakpoint = useBreakpoint();

    let noneFound = false;
    // Only apply search on mobile
    if (searchQuery !== '' && !breakpoint.md) {
        gameMetaData = gameMetaData.filter(game => game.name.toLowerCase().includes(searchQuery.toLowerCase()));
        noneFound = gameMetaData.length === 0;
    }

    const filterForConsole = (console: Console) => {
        return gameMetaData
            .filter(game => game.console == console && (showHiddenGames || !game.settings.hidden))
            .map(game => (
                <GameItem
                    key={game.uuid}
                    image={game.image}
                    name={game.name}
                    imageRendering={game.settings.imageRendering}
                    onActiveCallback={() => {
                        setSidePanelGame(game);
                    }}
                ></GameItem>
            ));
    };

    const closePanel = () => {
        setSidePanelGame(null);
    };

    return (
        <Fragment>
            <Navbar
                userName={userName}
                profileImage={profileImage}
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
            {sidePanelGame && (
                <Sidebar closePanel={closePanel} className="w-screen lg:w-168 h-screen flex flex-col">
                    {(closePanel: () => void) => (
                        <GameSidePanel
                            image={sidePanelGame.image}
                            imageRendering={sidePanelGame.settings.imageRendering}
                            hidden={sidePanelGame.settings.hidden}
                            deletable={sidePanelGame.settings.deletable}
                            name={sidePanelGame.name}
                            saveNames={sidePanelGame.saveNames}
                            gameUuid={sidePanelGame.uuid}
                            activeSaveIndex={sidePanelGame.activeSaveIndex}
                            closePanel={closePanel}
                        />
                    )}
                </Sidebar>
            )}
        </Fragment>
    );
}

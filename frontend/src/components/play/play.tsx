import { GameData, getGameData, useGameMetaData } from '@/src/storage/game-data';
import { useDatabase } from '@/src/storage/storage';
import { useActiveUserProfile } from '@/src/storage/user-data';
import { useQuery } from '@/src/util';
import React, { Fragment, useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Footer from '../footer/footer';
import NotFound from '../not-found/not-found';
import Navbar from '../util/navbar';

import Chip8Interface from './chip8/chip8';
import NesInterface from './nes/nes';

export default function Play() {
    const { path } = useRouteMatch();
    const [{ userName, profileImage }] = useActiveUserProfile();

    const query = useQuery();
    const uuid = query.get('game');

    const [gameMetaData] = useGameMetaData();

    const db = useDatabase();
    const [gameData, setGameData] = useState<GameData | null>(null);

    useEffect(() => {
        if (uuid === null) {
            return;
        }

        getGameData(db, uuid).then(gameData => {
            if (gameData !== undefined) {
                setGameData(gameData);
            }
        });
    }, [db, uuid]);

    if (uuid === null) {
        return <NotFound />;
    }

    // TODO: check for correct console aswell
    const gameMetaDataView = gameMetaData.find(item => item.uuid === uuid);
    if (gameMetaDataView === undefined) {
        return <NotFound />;
    }

    return (
        <Fragment>
            {gameData !== null && (
                <Switch>
                    <Route path={`${path}/CHIP 8`}>
                        <div className="flex-grow relative">
                            <Navbar userName={userName} profileImage={profileImage} />
                            <Chip8Interface gameUuid={uuid} gameMetaDataView={gameMetaDataView} rom={gameData.rom} />
                        </div>
                        <Footer />
                    </Route>
                    <Route path={`${path}/NES`}>
                        <div className="flex-grow relative">
                            <Navbar userName={userName} profileImage={profileImage} />
                            <NesInterface
                                gameUuid={uuid}
                                gameMetaDataView={gameMetaDataView}
                                rom={gameData.rom}
                                save={gameData.saves[gameMetaDataView.activeSaveIndex].data}
                            />
                        </div>
                        <Footer />
                    </Route>
                    <Route path="*">
                        <NotFound />
                    </Route>
                </Switch>
            )}
        </Fragment>
    );
}

import { GameData, getGameData, useGameMetaData } from '@/src/storage/game-data';
import { useDatabase } from '@/src/storage/storage';
import { useUserProfile } from '@/src/storage/user-data';
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
    const [{ userName, profileImage }] = useUserProfile();

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
            <div className="flex-grow relative">
                <Navbar userName={userName} profileImage={profileImage} />
                {gameData !== null && (
                    <Switch>
                        <Route path={`${path}/CHIP 8`}>
                            <Chip8Interface gameUuid={uuid} gameMetaDataView={gameMetaDataView} rom={gameData.rom} />
                        </Route>
                        <Route path={`${path}/NES`}>
                            <NesInterface
                                gameUuid={uuid}
                                gameMetaDataView={gameMetaDataView}
                                rom={gameData.rom}
                                save={gameData.saves[gameMetaDataView.activeSaveIndex].data}
                            />
                        </Route>
                        <Route path="*">
                            <NotFound />
                        </Route>
                    </Switch>
                )}
            </div>
            <Footer />
        </Fragment>
    );
}

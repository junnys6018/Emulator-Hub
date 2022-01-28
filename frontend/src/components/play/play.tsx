import { GameData, getGameData, useGameMetaData } from '@/src/storage/game-data';
import { useDatabase } from '@/src/storage/storage';
import { useQuery } from '@/src/util';
import React, { Fragment, useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import NotFound from '../not-found/not-found';
import UnderConstruction from '../under-construction/under-construction';
import WrapNavAndFooter from '../util/wrap-nav-and-footer';

import Chip8Interface from './chip8/chip8';
import NesInterface from './nes/nes';

export default function Play() {
    const { path } = useRouteMatch();

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
                        <WrapNavAndFooter>
                            <Chip8Interface gameUuid={uuid} gameMetaDataView={gameMetaDataView} rom={gameData.rom} />
                        </WrapNavAndFooter>
                    </Route>
                    <Route path={`${path}/NES`}>
                        <WrapNavAndFooter>
                            <NesInterface
                                gameUuid={uuid}
                                gameMetaDataView={gameMetaDataView}
                                rom={gameData.rom}
                                save={gameData.saves[gameMetaDataView.activeSaveIndex].data}
                            />
                        </WrapNavAndFooter>
                    </Route>
                    <Route path={`${path}/GB`}>
                        <UnderConstruction />
                    </Route>
                    <Route path={`${path}/GBC`}>
                        <UnderConstruction />
                    </Route>
                    <Route path="*">
                        <NotFound />
                    </Route>
                </Switch>
            )}
        </Fragment>
    );
}

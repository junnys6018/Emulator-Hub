import { useGameMetaData } from '@/src/storage/game-data';
import { useUserProfile } from '@/src/storage/user-data';
import { useQuery } from '@/src/util';
import React, { Fragment } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
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

    if (uuid === null) {
        return <NotFound />;
    }

    // TODO: check for correct console aswell
    if (gameMetaData.find(item => item.uuid === uuid) === undefined) {
        return <NotFound />;
    }

    return (
        <Fragment>
            <Navbar userName={userName} profileImage={profileImage} />
            <Switch>
                <Route path={`${path}/CHIP 8`}>
                    <Chip8Interface gameUuid={query.get('game') as string} />
                </Route>
                <Route path={`${path}/NES`}>
                    <NesInterface gameUuid={query.get('game') as string} />
                </Route>
                <Route path="*">
                    <NotFound />
                </Route>
            </Switch>
        </Fragment>
    );
}

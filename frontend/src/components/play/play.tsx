import { useUserProfile } from '@/src/storage/user-data';
import { useQuery } from '@/src/util';
import React, { Fragment } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import NotFound from '../not-found/not-found';
import Navbar from '../util/navbar';
import Chip8Interface from './chip8/chip8';

export default function Play() {
    const { path } = useRouteMatch();
    const [{ userName, profileImage }] = useUserProfile();

    const query = useQuery();

    if (query.get('game') === null) {
        return <NotFound />;
    }

    return (
        <Fragment>
            <Navbar userName={userName} profileImage={profileImage} />
            <Switch>
                <Route path={`${path}/CHIP 8`}>
                    <Chip8Interface gameUuid={query.get('game') as string} />
                </Route>
                <Route path="*">
                    <NotFound />
                </Route>
            </Switch>
        </Fragment>
    );
}

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NotFound from './components/not-found/not-found';
import Index from './components/index/index';
import AddRoms from './components/add-roms/add-roms';
import Dashboard from './components/dashboard/dashboard';
import Settings from './components/settings/settings';
import Play from './components/play/play';
import Login from './components/login/login';

import { BreakpointProvider } from '@/src/use-breakpoint';
import { UserProfileProvider } from './storage/user-data';
import { AlertProvider } from './components/util/alert';
import { DatabaseProvider } from './storage/storage';
import { MessageProvider } from './components/util/message';
import { GameMetaDataProvider } from './storage/game-data';
import { HasGamepadProvider } from './gamepad';

function App() {
    return (
        <Router>
            <BreakpointProvider>
                <AlertProvider>
                    <MessageProvider>
                        <DatabaseProvider>
                            <UserProfileProvider>
                                <GameMetaDataProvider>
                                    <HasGamepadProvider>
                                        <Switch>
                                            <Route exact path="/">
                                                <Index />
                                            </Route>
                                            <Route exact path="/dashboard">
                                                <Dashboard />
                                            </Route>
                                            <Route exact path="/add-roms">
                                                <AddRoms />
                                            </Route>
                                            <Route exact path="/settings">
                                                <Settings />
                                            </Route>
                                            <Route path="/play">
                                                <Play />
                                            </Route>
                                            <Route path="*">
                                                <NotFound />
                                            </Route>
                                        </Switch>
                                    </HasGamepadProvider>
                                </GameMetaDataProvider>
                            </UserProfileProvider>
                        </DatabaseProvider>
                    </MessageProvider>
                </AlertProvider>
            </BreakpointProvider>
        </Router>
    );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NotFound from './components/not-found/not-found';
import Index from './components/index/index';
import AddRoms from './components/add-roms/add-roms';
import Dashboard from './components/dashboard/dashboard';
import Settings from './components/settings/settings';
import Play from './components/play/play';
import Login from './components/login/login';
import LoginRequired from './components/util/login-required';

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
                                                <LoginRequired>
                                                    <Dashboard />
                                                </LoginRequired>
                                            </Route>
                                            <Route exact path="/add-roms">
                                                <LoginRequired>
                                                    <AddRoms />
                                                </LoginRequired>
                                            </Route>
                                            <Route exact path="/settings">
                                                <LoginRequired>
                                                    <Settings />
                                                </LoginRequired>
                                            </Route>
                                            <Route path="/play">
                                                <LoginRequired>
                                                    <Play />
                                                </LoginRequired>
                                            </Route>
                                            <Route path="/login">
                                                <Login />
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

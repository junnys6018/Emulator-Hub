import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NotFound from './components/not-found/not-found';
import Index from './components/index/index';
import AddRoms from './components/add-roms/add-roms';
import Dashboard from './components/dashboard/dashboard';
import Footer from './components/footer/footer';
import Settings from './components/settings/settings';

import { BreakpointProvider } from '@/src/use-breakpoint';
import { UserProfileProvider } from './storage/user-data';
import { AlertProvider } from './components/util/alert';
import { DatabaseProvider } from './storage/storage';

function App() {
    return (
        <Router>
            <BreakpointProvider>
                <AlertProvider>
                    <DatabaseProvider>
                        <UserProfileProvider>
                            <div className="flex-grow relative">
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
                                    <Route path="*">
                                        <NotFound />
                                    </Route>
                                </Switch>
                            </div>
                            <Footer />
                        </UserProfileProvider>
                    </DatabaseProvider>
                </AlertProvider>
            </BreakpointProvider>
        </Router>
    );
}

export default App;

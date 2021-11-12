import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NotFound from './components/not-found/not-found';
import Index from './components/index/index';
import AddRoms from './components/add-roms/add-roms';
import Dashboard from './components/dashboard/dashboard';
import Footer from './components/footer/footer';
import Settings from './settings/settings';

import { BreakpointProvider } from '@/src/use-breakpoint';

function App() {
    return (
        <Router>
            <BreakpointProvider>
                <div className="flex-grow">
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
            </BreakpointProvider>
        </Router>
    );
}

export default App;

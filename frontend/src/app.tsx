import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NotFound from './components/not-found/not-found';
import Index from './components/index/index';
import About from './components/about/about';
import Dashboard from './components/dashboard/dashboard';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Index />
                </Route>
                <Route exact path="/dashboard">
                    <Dashboard />
                </Route>
                <Route exact path="/about">
                    <About />
                </Route>
                <Route path="*">
                    <NotFound />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;

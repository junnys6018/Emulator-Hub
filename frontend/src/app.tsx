import NotFound from './components/not-found/not-found';
import Index from './components/index/index';
import About from './components/about/about';

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Index />
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

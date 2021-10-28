import NotFound from './not-found/not-found';
import Index from './index/index';
import About from './about/about';

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

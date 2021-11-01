import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NotFound from './components/not-found/not-found';
import Index from './components/index/index';
import About from './components/about/about';
import Dashboard from './components/dashboard/dashboard';
import Footer from './components/footer/footer';

function App() {
    return (
        <Router>
            <div className="container flex-grow">
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
            </div>
            <Footer />
        </Router>
    );
}

export default App;

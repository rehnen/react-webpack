import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Home = () => (
    <h1>Home</h1>
);

const About = () => (
    <div>
        <h2>About</h2>
        <p>Nobody ever has anything interesting to say here</p>
    </div>
);

const PageNotFound = () => (
    <h1>Page Not Found</h1>
);

const App = () => (
    <Router>
        <div>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route component={PageNotFound} />
            </Switch>
        </div>
    </Router>
);

export default App;

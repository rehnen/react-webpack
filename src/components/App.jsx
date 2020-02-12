import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RallyStage from './RallyStage';

const About = () => (
  <div>
    <h1>About</h1>
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
        <Route exact path="/" component={RallyStage} />
        <Route path="/about" component={About} />
        <Route component={PageNotFound} />
      </Switch>
    </div>
  </Router>
);

export default App;

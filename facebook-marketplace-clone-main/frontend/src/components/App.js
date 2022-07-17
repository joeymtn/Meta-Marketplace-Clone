import React from 'react';
import HomePage from './Home/HomePage';
import GlobalContextProvider from './GlobalContextProvider';
import SignUpForm from './Login/SignUpForm';
import LoginForm from './Login/LoginForm';
import LoginError from './Login/LoginError';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
// import Dummy from './Dummy';

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  return (
    <GlobalContextProvider>
      <Router>
        <Switch>
          <Route path='/signUp' exact component={SignUpForm}/>
          <Route path='/signUp/confirm' component={LoginError}/>
          <Route path='/login' component={LoginForm}/>
          <Route path='/' component={HomePage}/>
        </Switch>
      </Router>
    </GlobalContextProvider>
  );
}

export default App;

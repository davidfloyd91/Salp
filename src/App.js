import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import Sandbox from './Sandbox';
import Dashboard from './Dashboard';
import Login from './Login';
import Signup from './Signup';
import Nav from './Nav';
import Footer from './Footer';
import './App.css';
import { autoLogin } from './helpers';

class App extends Component {
  componentDidMount() {
    autoLogin(this.props);
  };

  render() {
    return (
      <Fragment>
        <Nav history={this.props.history} />
          <div className='container'>
            <Switch>
              <Route
                path='/charts/:id/edit'
                render={routerProps => {
                  return <Sandbox {...routerProps} />
                }}
              />
              <Route
                path='/charts/:id'
                render={routerProps => {
                  return <Dashboard {...routerProps} />
                }}
              />
              <Route
                path='/charts'
                render={routerProps => {
                  return <Dashboard {...routerProps} />
                }}
              />
              <Route
                path='/new'
                render={routerProps => {
                  return <Sandbox {...routerProps} />
                }}
              />
              <Route
                path='/login'
                render={routerProps => {
                  return <Login {...routerProps} />
                }}
              />
              <Route
                path='/signup'
                render={routerProps => {
                  return <Signup {...routerProps} />
                }}
              />
              <Redirect exact
                from='/'
                to='/charts'
              />
            </Switch>
          </div>
        <Footer />
      </Fragment>
    );
  };
};

function mapStateToProps(state) {
  return {
    userId: state.userId,
    new: state.new,
    edit: state.edit
  };
};

export default connect(mapStateToProps)(App);

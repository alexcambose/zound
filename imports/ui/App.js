import React, { Component } from 'react';
import Proptypes from 'proptypes';
import { Router, Route, Switch } from 'react-router';
import createBroweserHistory from 'history/createBrowserHistory';
import { withTracker } from 'meteor/react-meteor-data';
import privateRoutes from '/imports/ui/routes/private';
import publicRoutes from '/imports/ui/routes/public';

const history = createBroweserHistory();

class App extends Component {
    static propTypes = {
        user: Proptypes.object,
    };
    createRoutes = () => (this.props.user ? privateRoutes : publicRoutes).map((props, i) => <Route key={i} exact {...props}/>);
    render = () => {
        return (
            <Router history={history}>
                <Switch>
                    {this.createRoutes()}
                </Switch>
            </Router>
        );
    }
}

export default withTracker(() => ({
    user: Meteor.user()
}))(App);

import React, { Component } from 'react';
import Proptypes from 'proptypes';
import { Router, Route, Switch } from 'react-router';
import createBroweserHistory from 'history/createBrowserHistory';
import { withTracker } from 'meteor/react-meteor-data';
import privateRoutes from '/imports/ui/routes/private';
import publicRoutes from '/imports/ui/routes/public';
import privateContainer from '/imports/ui/pages/private/Container';
import publicContainer from '/imports/ui/pages/public/Container';

const history = createBroweserHistory();

class App extends Component {
    static propTypes = {
        user: Proptypes.object,
    };
    createRoutes = () => {
        const { user } = this.props;
        const Container = user ? privateContainer : publicContainer;
        return (
            <Container>
                {(this.props.user ? privateRoutes : publicRoutes).map((props, i) => <Route key={i} {...props}/>)}
            </Container>
        );
    };
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

import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { Router, Route, Switch } from 'react-router';
import createHashHistory from 'history/createBrowserHistory';
import { withTracker } from 'meteor/react-meteor-data';
import privateRoutes from '/imports/ui/routes/private';
import publicRoutes from '/imports/ui/routes/public';
import privateContainer from '/imports/ui/pages/private/Container';
import publicContainer from '/imports/ui/pages/public/Container';
import { Redirect } from 'react-router-dom';

const history = createHashHistory();

class App extends Component {
    static propTypes = {
        user: PropTypes.object,
    };
    createRoutes = () => {
        const { user } = this.props;
        const Container = user ? privateContainer : publicContainer;
        return (
            <Container>
                <Switch>
                {(this.props.user ? privateRoutes : publicRoutes).map((props, i) => <Route exact key={i} {...props}/>)}
                <Route path="/*" render={() => <Redirect to="/"/>}/>
                </Switch>
            </Container>
        );
    };
    render = () => {
        if(this.props.user === undefined) return null;
        return (
            <Router history={history}>
                {this.createRoutes()}
            </Router>
        );
    }
}

export default withTracker(() => ({
    user: Meteor.user()
}))(App);

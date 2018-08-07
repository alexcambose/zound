import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import { Router, Route, Switch } from 'react-router';
import createHashHistory from 'history/createBrowserHistory';
import { withTracker } from 'meteor/react-meteor-data';
import privateRoutes from '/imports/ui/routes/private';
import publicRoutes from '/imports/ui/routes/public';
import privateContainer from '/imports/ui/pages/private/Container';
import publicContainer from '/imports/ui/pages/public/Container';
import { Redirect } from 'react-router-dom';
import Drawer from './components/Drawer';

const history = createHashHistory();

class App extends Component {
    static propTypes = {
        user: PropTypes.object,
    };
    createRoutes = () => {
        const { user } = this.props;
        const Container = user ? privateContainer : publicContainer;
        return (
                <Switch>
                    {(user ? privateRoutes : publicRoutes).map(({ inContainer, component, ...props}, i) => {
                        const Component = component;
                        if(inContainer){
                            return <Route key={i} exact {...props} render={props => <Container><Component {...props}/></Container>}/>;
                        }
                        return <Route key={i} exact {...props} component={component} />;

                    })}
                    <Route path="/*" render={() => <Redirect to="/"/>}/>
                </Switch>
        );
    };
    render = () => {
        const { user } = this.props;
        if(user === undefined) return null;
        return (
            <Router history={history}>
                <Fragment>
                    {user && <Drawer/>}
                        {this.createRoutes()}
                </Fragment>
            </Router>
        );
    }
}

export default withTracker(() => ({
    user: Meteor.user()
}))(App);

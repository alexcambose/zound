import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import { Router, Route, Switch } from 'react-router';
import createHashHistory from 'history/createBrowserHistory';
import { withTracker } from 'meteor/react-meteor-data';
import privateRoutes from '/imports/ui/routes/private';
import publicRoutes from '/imports/ui/routes/public';
import Container from '/imports/ui/pages/Container';
import { Redirect } from 'react-router-dom';
import Drawer from './components/Drawer';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const history = createHashHistory();

class App extends Component {
    static propTypes = {
        user: PropTypes.object,
        theme: PropTypes.object,
    };
    createRoutes = () => {
        const { user } = this.props;
        return (
            <Switch>
                {(user ? privateRoutes : publicRoutes).map(({ component, ...props}, i) => {
                    const Component = component;
                        return <Route key={i} {...props} render={props => <Fragment><Container><Component {...props}/></Container></Fragment>}/>;

                })}
                <Route path="/*" render={() => <Redirect to="/"/>}/>
            </Switch>
        );
    };
    render = () => {
        const { user, theme } = this.props;
        if(user === undefined) return null;
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>
                <Router history={history}>
                    <Fragment>
                        {user && <Drawer/>}
                        {this.createRoutes()}
                    </Fragment>
                </Router>
            </MuiThemeProvider>
        );
    }
}

export default withTracker(() => ({
    user: Meteor.user(),
    theme: createMuiTheme({
        palette: {
            type: Meteor.user() && Meteor.user().profile.settings.darkTheme ? 'dark' : 'light',
        },
    })
}))(App);

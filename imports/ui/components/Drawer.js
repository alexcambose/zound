import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import { withStyles,Button, SwipeableDrawer, ListItemIcon, List, Icon, ListItemText, Divider, ListItem, AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import Parties from '../../db/parties/collection';
import DeletePartyButton from './DeletePartyButton';

const styles = theme => ({
    drawerWidth: {
        width: 320,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 10,
    },
    drawerHeader: {
        fontFamily: 'Roboto',
        height: 150,
        padding: 16,
        backgroundColor: '#2196f3',
        color: '#fff',
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        backgroundImage: 'url("/drawerbg.jpg")'
    },
    drawerHeaderName: {
        fontSize: '1.2em',
    },
    drawerHeaderImage: {
        borderRadius: 100,
        height: 50,
        width: 50,
        marginBottom: 10,
    },
    createParty: {
        marginLeft: 'auto',
        marginRight: 10
    },
    appBar: {
        marginBottom: 20,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    }
});

const TopList = () => (
    <Fragment>
        <List component="nav">
            <ListItem button>
                <ListItemIcon>
                    <Icon>email</Icon>
                </ListItemIcon>
                <ListItemText primary="Inbox" />
            </ListItem>
        </List>
        <Divider />
        <List component="nav">
            <ListItem button>
                <ListItemText primary="Trash" />
            </ListItem>
            <ListItem button component="a" href="#simple-list">
                <ListItemText primary="Spam" />
            </ListItem>
        </List>
        <List component="nav">
            <ListItem button component={Link} to="/">
                <ListItemIcon>
                    <Icon>settings</Icon>
                </ListItemIcon>
                <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button component={Link} to="/">
                <ListItemIcon>
                    <Icon>info</Icon>
                </ListItemIcon>
                <ListItemText primary="About" />
            </ListItem>
            <ListItem button onClick={Meteor.logout()}>
                <ListItemIcon>
                    <Icon>exit_to_app</Icon>
                </ListItemIcon>
                <ListItemText primary="Logout" />
            </ListItem>
        </List>
    </Fragment>
);

class Drawer extends Component {
    state = {
        opened: false,
    };
    static propTypes = {
        classes: PropTypes.object.isRequired,
        user: PropTypes.object,
        party: PropTypes.object,
    };
    toggleDrawer = opened => () => this.setState({ opened });
    isOnPartyPage = () => this.props.match.path.indexOf('/party/:id/') !== -1;
    render = () => {
        const { classes, user, party } = this.props;
        if(this.isOnPartyPage() && !party) return null;
        const additionalButtons = (
            <Fragment>
                {this.isOnPartyPage() && (
                    <DeletePartyButton party={party}/>
                )}
            </Fragment>
        );
        return (
            <Fragment>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <IconButton onClick={this.toggleDrawer(true)} color="inherit" className={classes.menuButton}>
                            <Icon>menu</Icon>
                        </IconButton>
                        <Typography variant="title" color="inherit">
                            Mance
                        </Typography>
                        <Button component={Link} to="/create-party" size="small" variant="raised" color="primary" className={classes.createParty}>Create Party <Icon className={classes.rightIcon}>add</Icon></Button>
                        {additionalButtons}
                    </Toolbar>
                </AppBar>
                <SwipeableDrawer
                    open={this.state.opened}
                    onClose={this.toggleDrawer(false)}
                    onOpen={this.toggleDrawer(true)}
                >
                    <div
                        className={classes.drawerWidth}
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer(false)}
                        onKeyDown={this.toggleDrawer(false)}
                    >
                        <div className={classes.drawerHeader}>
                            <img className={classes.drawerHeaderImage} src={'/' + user.profile.image}/>
                            <div className={classes.drawerHeaderName}>{user.profile.firstName} {user.profile.lastName}</div>
                            <div>{user.emails[0].address || ''}</div>
                        </div>
                        <TopList/>
                    </div>
                </SwipeableDrawer>
            </Fragment>
        );
    }
}

export default withTracker(props => {
    Meteor.subscribe('parties');
    return {
        party: Parties.findOne({_id: props.match.params.id}),
        user: Meteor.user()
    };
})(withRouter(withStyles(styles)(Drawer)));

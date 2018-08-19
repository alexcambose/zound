import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import { withStyles, SwipeableDrawer, ListItemIcon, List, Icon, ListItemText, Divider, ListItem, AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import Parties from '../../db/parties/collection';
import DeletePartyDialog from './DeletePartyDialog';

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
    additionalButtonsContainer: {
        marginLeft: 'auto',
        marginRight: 10
    },
    appBar: {
        position: 'fixed',
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
});

const TopList = () => (
    <List component="nav">
        <ListItem button component={Link} to="/">
            <ListItemIcon>
                <Icon>home</Icon>
            </ListItemIcon>
            <ListItemText primary="Home" />
        </ListItem>
        <ListItem button divider component={Link} to={"/profile/" + Meteor.userId()}>
            <ListItemIcon>
                <Icon>person</Icon>
            </ListItemIcon>
            <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button component={Link} to="/joined-parties">
            <ListItemIcon>
                <Icon>pages</Icon>
            </ListItemIcon>
            <ListItemText primary="Joined parties" />
        </ListItem>
        <ListItem button divider component={Link} to="/create-party">
            <ListItemIcon>
                <Icon>add</Icon>
            </ListItemIcon>
            <ListItemText primary="Create a party" />
        </ListItem>
        <ListItem button component={Link} to="/settings">
            <ListItemIcon>
                <Icon>settings</Icon>
            </ListItemIcon>
            <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button component={Link} to="/about">
            <ListItemIcon>
                <Icon>info</Icon>
            </ListItemIcon>
            <ListItemText primary="About" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <Icon>exit_to_app</Icon>
            </ListItemIcon>
            <ListItemText primary="Logout"/>
        </ListItem>
    </List>
);

class Drawer extends Component {
    state = {
        opened: false,
    };
    static propTypes = {
        classes: PropTypes.object.isRequired,
    };
    toggleDrawer = opened => () => this.setState({ opened });
    render = () => {
        const { classes } = this.props;
        const additionalButtons = (
            <div className={classes.additionalButtonsContainer}>
                {/*can be added later*/}
            </div>
        );
        return (
            <Fragment>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <IconButton onClick={this.toggleDrawer(true)} color="inherit" className={classes.menuButton}>
                            <Icon>menu</Icon>
                        </IconButton>
                        <Typography variant="title" color="inherit">
                            Zound
                        </Typography>
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
                            <img className={classes.drawerHeaderImage} src={'/' + Meteor.user().profile.image}/>
                            <div className={classes.drawerHeaderName}>{Meteor.user().profile.firstName} {Meteor.user().profile.lastName}</div>
                            <div>{Meteor.user().emails[0].address || ''}</div>
                        </div>
                        <TopList classes={classes}/>
                    </div>
                </SwipeableDrawer>
            </Fragment>
        );
    }
}

export default withStyles(styles)(Drawer);

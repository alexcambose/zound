import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { Avatar, withStyles, Typography, List, ListItem, ListItemIcon, Icon, ListItemText } from '@material-ui/core';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';

const styles = {
    container: {
        marginTop: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    bigAvatar: {
        width: 120,
        height: 120,
    },
    infoIcon: {
        marginRight: 0,
    },
    name: {
        marginTop: 10,
    }
};


class Profile extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        user: PropTypes.object,
    };
    render = () => {
        const { classes, user } = this.props;
        if(!user) return null;
        const { profile } = user;

        let infoElements = [
            {icon: 'account_circle', label: 'Joined ' + moment(user.createdAt).fromNow()},
        ];

        if(!!user.profile.settings.publicEmail) infoElements = [{icon: 'email', label: user.emails[0].address}, ...infoElements];
        return (
            <div className={classes.container}>
                <Avatar
                    alt="Adelle Charles"
                    src={'/'+profile.image}
                    className={classes.bigAvatar}
                />
                <Typography variant="headline" gutterBottom className={classes.name}>
                    {profile.firstName} {profile.lastName}
                </Typography>
                <List>
                    {infoElements.map(({ icon, label }, i) =>
                        <ListItem key={i}>
                            <ListItemIcon className={classes.infoIcon}>
                                <Icon>{icon}</Icon>
                            </ListItemIcon>
                            <ListItemText
                                primary={label}
                            />
                        </ListItem>
                    )}
                </List>
            </div>
        );
    }
}

export default withTracker(({ match }) => {
    const { user_id } = match.params;
    Meteor.subscribe('user', user_id);
    return {
        user: Meteor.users.findOne({_id: user_id}),
    }
})(withStyles(styles)(withRouter(Profile)));

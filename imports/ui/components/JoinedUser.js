import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import { Meteor } from 'meteor/meteor';
import { Avatar, Chip, Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';

class JoinedUser extends Component {
    state = {};
    static propTypes = {
        user_id: PropTypes.string.isRequired,
        date: PropTypes.instanceOf(Date).isRequired,
        partyHost: PropTypes.bool,
    };
    static defaultProps = {
        partyHost: false,
    };
    render = () => {
        const { user_id, date, users } = this.props;
        const user = users.find(e => e._id === user_id);
        return (
            <Card>
                <CardContent>
                    <CardHeader
                        component={Link}
                        style={{textDecoration: 'none'}}
                        to={'/profile/' + user_id}
                        avatar={<Avatar aria-label="Recipe" src={'/' + user.profile.image}/>}
                        title={user.profile.firstName + ' ' + user.profile.lastName}
                        subheader={'joined ' + moment(date).fromNow()}
                    />
                    <Chip color="primary" label="Host"/>
                </CardContent>
            </Card>
        );
    }
}

export default withTracker(props => {
    Meteor.subscribe('users');
    return {
        users: Meteor.users.find({}).fetch(),
    }
})(JoinedUser);

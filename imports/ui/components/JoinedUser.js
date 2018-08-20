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
        user: PropTypes.object,
    };
    static defaultProps = {
        partyHost: false,
    };
    render = () => {
        const { user_id, date, user, partyHost } = this.props;
        console.log(user);
        if(!user) return null;

        return (
            <Card style={{margin: '5px 0'}}>
                <CardContent>
                    <CardHeader
                        component={Link}
                        style={{textDecoration: 'none'}}
                        to={'/profile/' + user_id}
                        avatar={<Avatar aria-label="Recipe" src={'/' + user.profile.image}/>}
                        title={user.profile.firstName + ' ' + user.profile.lastName}
                        subheader={'joined ' + moment(date).fromNow()}
                    />
                    {partyHost && <Chip color="primary" label="Host"/>}
                </CardContent>
            </Card>
        );
    }
}

export default withTracker(props => {
    Meteor.subscribe('user', props.user_id);
    return {
        user: Meteor.users.findOne({_id: props.user_id}),
    }
})(JoinedUser);

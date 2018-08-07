import React, { Component } from 'react';
import Proptypes from 'proptypes';
import { Card, CardContent, Typography, CardHeader,IconButton, Avatar } from '@material-ui/core/';
import { withTracker } from 'meteor/react-meteor-data';

class PartyCard extends Component {
    state = {
        user: null,
    };
    static propTypes = {
        id: Proptypes.string.isRequired,
        title: Proptypes.string.isRequired,
        description: Proptypes.string.isRequired,
        joined_users: Proptypes.array.isRequired,
        startDate: Proptypes.instanceOf(Date).isRequired,
        endDate: Proptypes.instanceOf(Date).isRequired,
        upvotes: Proptypes.array.isRequired,
        downvotes: Proptypes.array.isRequired,
        user_id: Proptypes.string.isRequired,
    };
    componentDidMount = () => {
        Meteor.call('user.get', this.props.user_id, (err, user) => {
            console.log(user);
            this.setState({ user })
        });
    };
    render = () => {
        const { id, title, description, joined_users, startDate, endDate } = this.props;
        const { user } = this.state;
        if(!user) return null;
        return (
            <Card>
                <CardContent>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="Recipe" src={'/' + user.profile.image}/>
                        }
                        action={
                            <IconButton>
                                {/*<MoreVertIcon />*/}
                            </IconButton>
                        }
                        title={user.profile.firstName + ' ' + user.profile.lastName}
                        subheader="September 14, 2016"
                    />
                </CardContent>
            </Card>
        );
    }
}

export default PartyCard;

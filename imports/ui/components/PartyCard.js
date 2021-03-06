import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import { withStyles, Card, CardActions, CardContent, Button, Typography, CardHeader, Chip, Avatar } from '@material-ui/core/';
import { Link } from 'react-router-dom';
import moment from 'moment';
import VoteButtons from './VoteButtons';
import { withTracker } from 'meteor/react-meteor-data';
import pluralize from 'pluralize';
import { genres } from '/imports/ui/config';

const styles = theme => ({
    card: {
        margin: '5px 0',
    },
    cardContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    cardHeader: {
        padding: '12px 22px 12px 0',
    },
    viewButton: {
        width: '21vw',
    },
    detail: {
        width: '100%',
        textAlign: 'center',
        paddingTop: 10,
    },
    center:{
        textAlign: 'center',
    },
    genreChip: {
        margin: '0 5px',
    }
});

class PartyCard extends Component {
    state = {
        user: null,
    };
    static propTypes = {
        party: PropTypes.object.isRequired,
        user: PropTypes.object,
        noVote: PropTypes.bool,
    };

    vote = (isDownvote = false) => () => {
        Meteor.call('parties.toggleVote', isDownvote, this.props.party._id, (err, res) => {
            if(err) {
                alert('error voting!');
                console.log(err);
            }
        })
    };
    render = () => {
        const { _id, title, description, joined_users, startDate, endDate, created_at, genre, upvotes, downvotes } = this.props.party;
        const { classes, user, noVote } = this.props;
        const userIsJoined = this.props.party.joined_users.find(e => e.user_id === Meteor.userId());
        if(!user) return null;
        return (
            <div className={classes.cardContainer}>
                <Card className={classes.card} raised>
                    <CardContent>
                        <CardHeader
                            avatar={<Avatar aria-label="Recipe" src={'/' + user.profile.image}/>}
                            action={
                                userIsJoined ?
                                    <Fragment>
                                        <Button component={Link} to={'/party/' + _id + '/music'} color='primary' className={classes.viewButton}>
                                            View
                                        </Button>
                                    </Fragment>
                                        :
                                    <Button component={Link} to={'/join-party/' + _id} variant='contained' color='secondary' className={classes.viewButton}>
                                        View
                                    </Button>
                            }
                            title={user.profile.firstName + ' ' + user.profile.lastName}
                            subheader={moment(created_at).fromNow()}
                            className={classes.cardHeader}
                        />
                        <Typography variant="headline">{title}</Typography>
                        <Typography variant="subheading" color="textSecondary">{description}</Typography>
                        <div className={classes.center}>
                            {genre.map((e, i) => <Chip label={genres[e]} key={i} className={classes.genreChip}/>)}
                        </div>
                        <Typography variant="body1" className={classes.detail}>
                            <strong>From:</strong> {moment(startDate).format('MMMM Do YYYY, h:mm a')} <strong>to</strong> {moment(endDate).format('MMMM Do YYYY, h:mm a')}
                        </Typography>
                        <Typography variant="body1" className={classes.detail}>
                            {joined_users.length} {pluralize('people', joined_users.length)} joined
                        </Typography>
                    </CardContent>
                    <CardActions>
                        {!noVote && <VoteButtons upvotes={upvotes} downvotes={downvotes} onUpvote={this.vote()} onDownvote={this.vote(true)}/> }
                    </CardActions>
                </Card>
            </div>
        );
    }
}

export default withTracker(({ party }) => {
    Meteor.subscribe('user', party.user_id);
    return {
        user: Meteor.users.findOne({_id: party.user_id}),
    }
})(withStyles(styles)(PartyCard));

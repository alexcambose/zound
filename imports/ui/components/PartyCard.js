import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import { withStyles, Card,Icon, CardActions, CardContent, Button, Typography, CardHeader,IconButton, Avatar } from '@material-ui/core/';
import { Link } from 'react-router-dom';
import moment from 'moment';

const styles = theme => ({
    card: {
        maxWidth: 800,
        margin: 10,
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
    votes: {
        color: '#999',
        marginRight: 4,
        marginLeft: 0
    },
    cardActions: {
        display: 'flex',
    },
    cardAction: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    voteClear: {
        color: theme.palette.primary.light,
    },
    voteFull: {
        color: theme.palette.primary.dark,
    }
});

class PartyCard extends Component {
    state = {
        user: null,
    };
    static propTypes = {
        party: PropTypes.object.isRequired,
    };
    componentDidMount = () => {
        Meteor.call('user.get', this.props.party.user_id, (err, user) => {
            console.log(user);
            this.setState({ user })
        });
    };
    vote = (isDownvote = false) => () => {
        Meteor.call('parties.toggleVote', isDownvote, this.props.party._id, (err, res) => {
            console.log(err, res);
        })
    };
    render = () => {
        const { _id, title, description, joined_users, startDate, endDate, created_at, upvotes, downvotes } = this.props.party;
        const { classes } = this.props;
        const { user } = this.state;
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
                        <Typography variant="body1" className={classes.detail}>
                            <strong>From:</strong> {moment(startDate).format('MMMM Do YYYY, h:mm a')} <strong>to</strong> {moment(endDate).format('MMMM Do YYYY, h:mm a')}
                        </Typography>
                        <Typography variant="body1" className={classes.detail}>
                            {joined_users.length} people joined
                        </Typography>
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                        <div className={classes.cardAction}>
                            <IconButton className={upvotes.find(e => e === Meteor.userId()) ? classes.voteFull : classes.votes} onClick={this.vote()}>
                                <Icon>thumb_up</Icon>
                            </IconButton>
                            <span>{upvotes.length}</span>
                        </div>
                        <div className={classes.cardAction}>
                            <IconButton className={downvotes.find(e => e === Meteor.userId()) ? classes.voteFull : classes.votes} onClick={this.vote(true)}>
                                <Icon>thumb_down</Icon>
                            </IconButton>
                            <span>{downvotes.length}</span>
                        </div>
                    </CardActions>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(PartyCard);

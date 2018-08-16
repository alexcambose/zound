import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import { withStyles, Icon, IconButton, CardActions } from '@material-ui/core';

const styles = theme => ({
    buttonsContainer: {
        display: 'flex',
        width: '100%',
    },
    buttonContainer: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    votes: {
        color: '#999',
        marginRight: 4,
        marginLeft: 0
    },
    voteClear: {
        color: theme.palette.primary.light,
    },
    voteFull: {
        color: theme.palette.primary.dark,
    }
});

class VoteButtons extends Component {
    static propTypes = {
        onUpvote: PropTypes.func.isRequired,
        onDownvote: PropTypes.func.isRequired,
        upvotes: PropTypes.array.isRequired,
        downvotes: PropTypes.array.isRequired
    };
    static defaultProps = {
        upvotes: [],
        downvotes: [],
    };
    render = () => {
        const { classes, onUpvote, onDownvote, upvotes, downvotes } = this.props;
        return (
            <div className={classes.buttonsContainer}>
                <div className={classes.buttonContainer}>
                    <IconButton className={upvotes.find(e => e === Meteor.userId()) ? classes.voteFull : classes.votes} onClick={onUpvote}>
                        <Icon>thumb_up</Icon>
                    </IconButton>
                    <span>{upvotes.length}</span>
                </div>
                <div className={classes.buttonContainer}>
                    <IconButton className={downvotes.find(e => e === Meteor.userId()) ? classes.voteFull : classes.votes} onClick={onDownvote}>
                        <Icon>thumb_down</Icon>
                    </IconButton>
                    <span>{downvotes.length}</span>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(VoteButtons);

import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { Card, CardContent, Typography, CardMedia, withStyles, Icon, IconButton, Menu, MenuItem, Chip, ListItemIcon } from '@material-ui/core';
import VoteButtons from './VoteButtons';
import moment from 'moment';

const styles = theme => ({
    cardElement: {
        marginTop: 5,
        marginBottom: 5,
    },
    card: {
        display: 'flex',
    },
    cardMediaAndContent: {
        display: 'flex',
        flex: 1,
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'center',
        }
    },
    cover: {
        width: 200,
        height: 260,
        [theme.breakpoints.down('sm')]: {
            marginLeft: 48,
        }
    },
    chip: {
        margin: theme.spacing.unit,
        marginLeft: 0,
    },
    cardContent: {
        flex: 1,
    },
    menu: {
        marginRight: 10,
    },
    summary: {
        padding: 10,
        paddingBottom: 0,
    }
});

class SongCard extends Component {
    state = {
        anchorEl: null,
    };
    static propTypes = {
        song: PropTypes.object.isRequired,
        party: PropTypes.object.isRequired,
        classes: PropTypes.object.isRequired,
        isCurrentlyPlaying: PropTypes.bool,
    };
    static defaultProps = {
        isCurrentlyPlaying: false,
    };
    vote = (isDownvote = false) => () => {
        Meteor.call('songs.toggleVote', isDownvote, this.props.song._id, (err, res) => {
            if(err) {
                alert('error voting!');
                console.log(err);
            }
        })
    };
    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };
    setAsCurrentSong = () => {
        this.handleClose();
        Meteor.call('songs.setCurrent', this.props.party._id, this.props.song._id, (err, res) => {
            if(err) {
                alert('error setting song!');
                console.log(err);
            }
            console.log(res);
        });
    };
    delete = () => {
        this.handleClose();
        Meteor.call('songs.remove', this.props.song._id, (err, res) => {
            if(err) {
                alert('error deleting song!');
                console.log(err);
            }
        });
    };
    removeFromPlaying = () => {
        this.handleClose();
        Meteor.call('songs.removeFromPlaying', this.props.song._id, (err, res) => {
            if(err) {
                alert('error deleting song!');
                console.log(err);
            }
        });
    };
    render = () => {
        const { classes, song, party, isCurrentlyPlaying } = this.props;
        const { anchorEl } = this.state;
        const songData = JSON.parse(song.data);
        return (
            <Card className={classes.cardElement} raised={isCurrentlyPlaying}>
                <div className={classes.card}>
                    <div className={classes.cardMediaAndContent}>
                        <CardMedia
                            className={classes.cover}
                            image={songData.image[2]['#text']}
                        />
                        <CardContent className={classes.cardContent}>
                            <Typography variant="headline">{songData.name}</Typography>
                            <Typography variant="subheading" color="textSecondary">
                                {songData.artist}
                            </Typography>
                            {parseInt(songData.info.duration) !== 0 &&
                            <Typography gutterBottom>
                                Duration: <strong>{moment.duration(parseInt(songData.info.duration), 'milliseconds').format()}</strong>
                            </Typography>
                            }
                            {songData.info.toptags.tag.map((e, i) => <Chip key={i} label={e.name} className={classes.chip}/>)}
                            {songData.info.wiki && <Typography className={classes.summary}>{songData.info.wiki.summary}</Typography>}
                        </CardContent>
                    </div>
                    <IconButton
                        aria-label="More"
                        aria-owns={open ? 'long-menu' : null}
                        aria-haspopup="true"
                        onClick={this.handleClick}
                    >
                        <Icon>more_vert</Icon>
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={this.handleClose}
                        className={classes.menu}
                    >
                        {Meteor.userId() === party.user_id && !isCurrentlyPlaying && <MenuItem onClick={this.setAsCurrentSong}><ListItemIcon><Icon>add</Icon></ListItemIcon>Set as current song</MenuItem>}
                        {Meteor.userId() === party.user_id && isCurrentlyPlaying && <MenuItem onClick={this.removeFromPlaying}><ListItemIcon><Icon>voice_over_off</Icon></ListItemIcon>Remove from playing</MenuItem>}
                        {Meteor.userId() === song.user_id && !isCurrentlyPlaying && <MenuItem onClick={this.delete}><ListItemIcon><Icon>delete</Icon></ListItemIcon> Delete</MenuItem>}

                    </Menu>
                </div>

                <VoteButtons upvotes={song.upvotes} downvotes={song.downvotes} onUpvote={this.vote()} onDownvote={this.vote(true)}/>

            </Card>
        );
    }
}

export default withStyles(styles)(SongCard);

import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { Card, CardContent, Typography, CardMedia, withStyles, Icon, IconButton, Menu, MenuItem, Chip, ListItemIcon } from '@material-ui/core';
import VoteButtons from './VoteButtons';

const styles = theme => ({
    cardElement: {
        marginTop: 10,
    },
    card: {
        display: 'flex',
    },
    cover: {
        width: 160,
        height: 160,
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
    }
});

class SongCard extends Component {
    state = {
        anchorEl: null,
    };
    static propTypes = {
        song: PropTypes.object.isRequired,
        party: PropTypes.object.isRequired,
    };
    static defaultProps = {};
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
    render = () => {
        const { classes, song, party } = this.props;
        const { anchorEl } = this.state;
        const songData = JSON.parse(song.data);
        return (
            <Card className={classes.cardElement}>
                <div className={classes.card}>
                    <CardMedia
                        className={classes.cover}
                        image={songData.image[2]['#text']}
                    />
                    <CardContent className={classes.cardContent}>
                        <Typography variant="headline">{songData.name}</Typography>
                        <Typography variant="subheading" color="textSecondary">
                            {songData.artist}
                        </Typography>
                        {songData.info.toptags.tag.map((e, i) => <Chip key={i} label={e.name} className={classes.chip}/>)}

                    </CardContent>
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
                        {Meteor.userId() === party.user_id && <MenuItem onClick={this.setAsCurrentSong}><ListItemIcon><Icon>add</Icon></ListItemIcon>Set as current song</MenuItem>}
                        {Meteor.userId() === song.user_id && <MenuItem onClick={this.delete}><ListItemIcon><Icon>delete</Icon></ListItemIcon> Delete</MenuItem>}
                    </Menu>
                </div>

                {songData.info.wiki && <Typography gutterBottom>{songData.info.wiki.summary}</Typography>}
                <VoteButtons upvotes={song.upvotes} downvotes={song.downvotes} onUpvote={this.vote()} onDownvote={this.vote(true)}/>

            </Card>
        );
    }
}

export default withStyles(styles)(SongCard);

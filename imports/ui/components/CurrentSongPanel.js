import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { Paper, withStyles, Typography } from '@material-ui/core';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { withTracker } from 'meteor/react-meteor-data';
import Songs from '../../db/songs/collection';
import SongCard from './SongCard';

const styles = theme => ({
    paper: {
        padding: 30,
        marginBottom: 10,
        [theme.breakpoints.down('md')]: {
            padding: 10,
        },
    }
});

class CurrentSongPanel extends Component {
    static propTypes = {
        party: PropTypes.object,
        currentSong: PropTypes.object,
        classes: PropTypes.object.isRequired,
        width: PropTypes.string.isRequired,
    };
    render = () => {
        const { currentSong, classes, party, width } = this.props;
        if(!currentSong)
            return (
                <Paper className={classes.paper}>
                    <Typography variant={isWidthDown('sm', width) ? 'title' : 'display1'} align='center'>
                        No song is currently playing
                    </Typography>
                </Paper>
            );
        return (
            <SongCard song={currentSong} party={party} isCurrentlyPlaying/>
        );
    }
}

export default withTracker(({ party }) => {
    Meteor.subscribe('songs', party._id);
    return {
        currentSong: Songs.findOne({_id: party.current_song_id}),
    }
})(withStyles(styles)(withWidth()(CurrentSongPanel)));

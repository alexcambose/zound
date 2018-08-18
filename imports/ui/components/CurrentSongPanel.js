import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { withTracker } from 'meteor/react-meteor-data';
import Songs from '../../db/songs/collection';
import SongCard from './SongCard';
import TextPaper from './TextPaper';


class CurrentSongPanel extends Component {
    static propTypes = {
        party: PropTypes.object,
        currentSong: PropTypes.object,
    };
    render = () => {
        const { currentSong, party } = this.props;
        if(!currentSong)
            return <TextPaper>No song is currently playing</TextPaper>;
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
})(CurrentSongPanel);

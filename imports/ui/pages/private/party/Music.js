import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import SongSelectButton from '../../../components/SongSelectButton';
import { withTracker } from 'meteor/react-meteor-data';
import Songs from '../../../../db/songs/collection';
import SongCard from '../../../components/SongCard';
import CurrentSongPanel from '../../../components/CurrentSongPanel';
import TextPaper from '../../../components/TextPaper';


class Music extends Component {
    state = {};
    static propTypes = {
        party: PropTypes.object.isRequired,
        songs: PropTypes.array,
    };
    static defaultProps = {
        songs: [],
    };
    handleSelected = song => {
        Meteor.call('songs.add', this.props.party._id, song, (err, res) => {
            if (err) console.log(err);
        });
    };
    render = () => {
        const { songs, party } = this.props;
        return (
            <Fragment>
                <CurrentSongPanel party={party}/>
                <SongSelectButton color={party.color} onSelected={this.handleSelected} title="Add suggestion"/>
                {songs.length === 0 ?
                    <TextPaper>No suggestions</TextPaper>
                    :
                    songs.map(e => <SongCard song={e} party={party} key={e._id}/>)}
            </Fragment>
        );
    }
}

export default withTracker(({ party }) => {
    Meteor.subscribe('songs', party._id);
    return {
        songs: Songs.find({}).fetch().filter(e => e._id !== party.current_song_id).sort((a, b) => b.upvotes.length - a.upvotes.length),
    }
})(Music);

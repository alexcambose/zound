import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import SongSelectButton from '../../../components/SongSelectButton';
import { withTracker } from 'meteor/react-meteor-data';
import Songs from '../../../../db/songs/collection';
import SongCard from '../../../components/SongCard';

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
            if(err) console.log(err);
        });
    };
    render = () => {
        const { songs, party } = this.props;
        return (
            <Fragment>
                <SongSelectButton onSelected={this.handleSelected}/>
                {songs.map(e => <SongCard song={e} party={party} key={e._id}/>)}
            </Fragment>
        );
    }
}

export default withTracker(({ party }) => {
    Meteor.subscribe('songs', party._id);
    return {
        songs: Songs.find({}).fetch().sort((a, b) => b.upvotes.length-a.upvotes.length),
    }
})(Music);

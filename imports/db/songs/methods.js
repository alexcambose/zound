import Songs from './collection';
import Parties from '../parties/collection';

Meteor.methods({
    'songs.add': (party_id, data) => {
        Songs.insert({
            user_id: Meteor.userId(),
            data,
            party_id,
            upvotes: [],
        })
    },
    'songs.setCurrent': (party_id, current_song_id) => {
        Parties.update({_id: party_id}, {current_song_id});
    },
    'songs.remove': _id => {
        Songs.remove({_id});
    }
});
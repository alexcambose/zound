import Songs from './collection';
import Parties from '../parties/collection';

Meteor.methods({
    'songs.add': (party_id, data) => {
        console.log(JSON.stringify(data));
        Songs.insert({
            user_id: Meteor.userId(),
            data: JSON.stringify(data),
            party_id,
            upvotes: [],
            downvotes: [],
        })
    },
    'songs.setCurrent': (party_id, current_song_id) => {
        Parties.update({_id: party_id}, {$set: {current_song_id}});
    },
    'songs.remove': _id => {
        Songs.remove({_id});
        console.log(`Song ${_id} removed`);
    },
    'songs.toggleVote': (isDownvote = false, _id) => {
        const songs = Songs.findOne({_id});
        const key = isDownvote ? 'downvotes' : 'upvotes';
        const keyInverse = isDownvote ? 'upvotes' : 'downvotes';

        if(songs[key].find(e => e === Meteor.userId())){ // remove from up/down votes
            Songs.update({_id}, {
                $pull: {
                    [key]: Meteor.userId(),
                }
            });
        } else {
            Songs.update({_id}, {
                $push: {
                    [key]: Meteor.userId(),
                }
            });
            Songs.update({_id}, {
                $pull: {
                    [keyInverse]: Meteor.userId(),
                }
            })
        }
    },
});
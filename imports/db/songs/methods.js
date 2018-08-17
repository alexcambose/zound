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
    'songs.setCurrent': (party_id, new_song_id) => {
        const currentSongId = Parties.findOne({_id: party_id}).current_song_id;
        if(currentSongId) Songs.remove({_id: currentSongId});

        Parties.update({_id: party_id}, {$set: {current_song_id: new_song_id}});
        console.log(`Playing song ${new_song_id} at party ${party_id}, removed song ${currentSongId}`)
    },
    'songs.remove': _id => {
        if(Parties.findOne({current_song_id: _id})) throw new Meteor.Error('remove', 'Cannot remove a song that is playing');
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
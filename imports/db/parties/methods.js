import Parties from './collection';
import Songs from '../songs/collection';

Meteor.methods({
    'parties.insert': ({ title, description, genre, startDate, endDate, password, color }) => {
        const data = { title, description, genre, startDate, endDate, current_song_id: '', password, joined_users: [{user_id: Meteor.userId(), date: new Date}], user_id: Meteor.userId(), created_at: new Date, upvotes: [], downvotes: [], color };
        try {
            const validation = Parties.simpleSchema().validate(data);
        }catch(e) {
            throw new Meteor.Error('validation-error', e.message);
        }

        Parties.insert(data, (error, result) => {
            if(error) console.log(error);
            console.log(`New party created with id "${result}"`);
        })
    },
    'parties.toggleVote': (isDownvote = false, _id) => {
        const party = Parties.findOne({_id});
        const key = isDownvote ? 'downvotes' : 'upvotes';
        const keyInverse = isDownvote ? 'upvotes' : 'downvotes';

        if(party[key].find(e => e === Meteor.userId())){ // remove from up/down votes
            Parties.update({_id}, {
                $pull: {
                    [key]: Meteor.userId(),
                }
            });
        } else {
            Parties.update({_id}, {
                $push: {
                    [key]: Meteor.userId(),
                }
            });
            Parties.update({_id}, {
                $pull: {
                    [keyInverse]: Meteor.userId(),
                }
            });
        }
    },
    'parties.toggleJoin': (_id, password = null) => { //password is optional, only used at joining
        const party = Parties.findOne({_id});
        if(party.joined_users.find(e => e === Meteor.userId())) {
            if(Meteor.userId() === party.user_id) throw new Meteor.Error('party-leave', 'Cannot leave party if you created it!');
            Parties.update({_id}, {
                $pull: {
                    joined_users: { user_id : Meteor.userId()},
                }
            });
            console.log(`User '${Meteor.userId()}' left party '${party._id}'`);
        } else if(party.password === password) {
            Parties.update({_id}, {
                $push: {
                    joined_users: { user_id: Meteor.userId(), date: new Date},
                }
            });
            console.log(`User '${Meteor.userId()}' joined party '${party._id}'`);
        } else {
            throw new Meteor.Error('invalid-party-password', 'Wrong password!');
        }
    },
    'parties.remove': _id =>{
        const party = Parties.findOne({_id});
        if(party.user_id === Meteor.userId()) {
            Songs.remove({party_id: _id});
            Parties.remove({_id});
            console.log(`User '${Meteor.userId()}' deleted party '${party._id}'`);
        }
    }
});
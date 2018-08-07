import Parties from './collection';

Meteor.methods({
    'parties.insert': ({ title, description, genre, startDate, endDate }) => {
        const data = { title, description, genre, startDate, endDate, joined_users: [], user_id: Meteor.userId(), created_at: new Date, upvotes: [], downvotes: [] };
        try {
            const validation = Parties.simpleSchema().validate(data);
        }catch(e) {
            throw new Meteor.Error('validation-error', e.message);
        }

        Parties.insert(data, (error, result) => {
            console.log(`New party created with id "${result}"`);
        })
    }
});
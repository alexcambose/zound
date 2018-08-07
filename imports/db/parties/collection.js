import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Parties = new Mongo.Collection('parties');

const PartiesSchema = new SimpleSchema({
    title: {
        type: String,
        max: 200,
        min: 3,
    },
    description: {
        type: String,
        max: 2000,
    },
    genre: {
        type: Array,
    },
    'genre.$': {
        type: Number,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    user_id: {
        type: String,
    },
    joined_users: {
        type: Array,
    },
    'joined_users.$': {
        type: String,
    },
    created_at: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();
            }
        },
    },
    updated_at: {
        type: Date,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        optional: true
    },
    upvotes: {
        type: Array,
        defaultValue: []
    },
    'upvotes.$': {
        type: String,
    },
    downvotes: {
        type: Array,
    },
    'downvotes.$': {
        type: String,
    }
});
Parties.attachSchema(PartiesSchema);
export default Parties;
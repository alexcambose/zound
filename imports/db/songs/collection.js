import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Songs = new Mongo.Collection('songs');

const SongsSchema = new SimpleSchema({
    party_id: {
        type: String,
    },
    user_id: {
        type: String,
    },
    data: {
        type: String, //JSON string
    },
    upvotes: {
        type: Array,
    },
    'upvotes.$': {
        type: String,
    },
    downvotes: {
        type: Array,
    },
    'downvotes.$': {
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
});
Songs.attachSchema(SongsSchema);
export default Songs;
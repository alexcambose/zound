import Songs from './collection';

Meteor.publish('songs', party_id => Songs.find({ party_id }));
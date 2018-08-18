Meteor.publish('users', () => Meteor.users.find({}));
Meteor.publish('user', _id => Meteor.users.find({_id}));
Meteor.methods({
    'user.get': id => Meteor.users.findOne({_id: id}),
});
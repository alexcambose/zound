import Parties from '../parties/collection';
import Songs from '../songs/collection';

Meteor.methods({
    'user.get': id => Meteor.users.findOne({_id: id}),
    'user.updateAccount': ({ firstName, lastName, email, currentPassword, newPassword, confirmNewPassword }) => {
        if(currentPassword) {
            if(newPassword !== confirmNewPassword) throw new Meteor.Error('password', 'Passwords don\'t match!');
            if(Accounts._checkPassword(Meteor.user(), currentPassword))
                Accounts.setPassword(Meteor.userId(), newPassword);

        }
        Meteor.users.update(Meteor.userId(), {$set: {
            'emails.0.address': email,
            'profile.firstName': firstName,
            'profile.lastName': lastName
        }});
    },
    'user.updateSettings': ({ darkTheme, publicEmail }) => {
        Meteor.users.update(Meteor.userId(), {$set: {
            'profile.settings.darkTheme': darkTheme,
            'profile.settings.publicEmail': publicEmail
        }});
    },
    'user.removeAccount': () => {
        Parties.remove({user_id: Meteor.userId()});
        Parties.update({}, {
            $pull: {
                upvotes: Meteor.userId(),
                downvotes: Meteor.userId(),
                joined_users: { user_id : Meteor.userId() },
            }
        });
        Songs.remove({user_id: Meteor.userId()});
        Songs.update({}, {
            $pull: {
                upvotes: Meteor.userId(),
                downvotes: Meteor.userId(),
            }
        });
        Meteor.users.remove({_id: Meteor.userId()});
    },
});

import Parties from './collection';
Meteor.publish('parties', () => Parties.find({}));
Meteor.publish('parties.joined', u_id => Parties.find({}));
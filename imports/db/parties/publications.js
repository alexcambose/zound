import Parties from './collection';
Meteor.publish('parties', () => Parties.find({}));
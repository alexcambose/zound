var require = meteorInstall({"imports":{"db":{"parties":{"collection.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/db/parties/collection.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let SimpleSchema;
module.watch(require("simpl-schema"), {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
const Parties = new Mongo.Collection('parties');
const PartiesSchema = new SimpleSchema({
  // url: {
  //     type: String,
  //     min: 2,
  //     max: 20,
  //     index: true,
  //     unique: true
  // },
  title: {
    type: String,
    max: 200,
    min: 3
  },
  description: {
    type: String,
    max: 2000
  },
  genre: {
    type: Array
  },
  'genre.$': {
    type: Number
  },
  color: {
    type: String
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  password: {
    type: String,
    min: 3,
    max: 20
  },
  user_id: {
    type: String
  },
  joined_users: {
    type: Array
  },
  current_song_id: {
    type: String,
    defaultValue: ''
  },
  'joined_users.$': {
    type: Object
  },
  'joined_users.$.user_id': {
    type: String
  },
  'joined_users.$.date': {
    type: Date
  },
  created_at: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset();
      }
    }
  },
  updated_at: {
    type: Date,
    autoValue: function () {
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
    type: String
  },
  downvotes: {
    type: Array
  },
  'downvotes.$': {
    type: String
  }
});
Parties.attachSchema(PartiesSchema);
module.exportDefault(Parties);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/db/parties/methods.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Parties;
module.watch(require("./collection"), {
  default(v) {
    Parties = v;
  }

}, 0);
let Songs;
module.watch(require("../songs/collection"), {
  default(v) {
    Songs = v;
  }

}, 1);
Meteor.methods({
  'parties.insert': ({
    title,
    description,
    genre,
    startDate,
    endDate,
    password,
    color
  }) => {
    const data = {
      title,
      description,
      genre,
      startDate,
      endDate,
      current_song_id: '',
      password,
      joined_users: [{
        user_id: Meteor.userId(),
        date: new Date()
      }],
      user_id: Meteor.userId(),
      created_at: new Date(),
      upvotes: [],
      downvotes: [],
      color
    };

    try {
      const validation = Parties.simpleSchema().validate(data);
    } catch (e) {
      throw new Meteor.Error('validation-error', e.message);
    }

    Parties.insert(data, (error, result) => {
      if (error) console.log(error);
      console.log(`New party created with id "${result}"`);
    });
  },
  'parties.toggleVote': (isDownvote = false, _id) => {
    const party = Parties.findOne({
      _id
    });
    const key = isDownvote ? 'downvotes' : 'upvotes';
    const keyInverse = isDownvote ? 'upvotes' : 'downvotes';

    if (party[key].find(e => e === Meteor.userId())) {
      // remove from up/down votes
      Parties.update({
        _id
      }, {
        $pull: {
          [key]: Meteor.userId()
        }
      });
    } else {
      Parties.update({
        _id
      }, {
        $push: {
          [key]: Meteor.userId()
        }
      });
      Parties.update({
        _id
      }, {
        $pull: {
          [keyInverse]: Meteor.userId()
        }
      });
    }
  },
  'parties.toggleJoin': (_id, password = null) => {
    //password is optional, only used at joining
    const party = Parties.findOne({
      _id
    });

    if (party.joined_users.find(e => e.user_id === Meteor.userId())) {
      if (Meteor.userId() === party.user_id) throw new Meteor.Error('party-leave', 'Cannot leave party if you created it!');
      Parties.update({
        _id
      }, {
        $pull: {
          joined_users: {
            user_id: Meteor.userId()
          }
        }
      });
      console.log(`User '${Meteor.userId()}' left party '${party._id}'`);
    } else if (party.password === password) {
      Parties.update({
        _id
      }, {
        $push: {
          joined_users: {
            user_id: Meteor.userId(),
            date: new Date()
          }
        }
      });
      console.log(`User '${Meteor.userId()}' joined party '${party._id}'`);
    } else {
      throw new Meteor.Error('invalid-party-password', 'Wrong password!');
    }
  },
  'parties.remove': _id => {
    const party = Parties.findOne({
      _id
    });

    if (party.user_id === Meteor.userId()) {
      Songs.remove({
        party_id: _id
      });
      Parties.remove({
        _id
      });
      console.log(`User '${Meteor.userId()}' deleted party '${party._id}'`);
    }
  },
  'parties.update': (_id, {
    title,
    description,
    genre,
    startDate,
    endDate,
    color,
    password
  }) => {
    Parties.update({
      _id
    }, {
      $set: {
        title,
        description,
        genre,
        startDate,
        endDate,
        color,
        password
      }
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"publications.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/db/parties/publications.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Parties;
module.watch(require("./collection"), {
  default(v) {
    Parties = v;
  }

}, 0);
Meteor.publish('parties', () => Parties.find({}));
Meteor.publish('parties.joined', u_id => Parties.find({}));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"songs":{"collection.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/db/songs/collection.js                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let SimpleSchema;
module.watch(require("simpl-schema"), {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
const Songs = new Mongo.Collection('songs');
const SongsSchema = new SimpleSchema({
  party_id: {
    type: String
  },
  user_id: {
    type: String
  },
  data: {
    type: String //JSON string

  },
  upvotes: {
    type: Array
  },
  'upvotes.$': {
    type: String
  },
  downvotes: {
    type: Array
  },
  'downvotes.$': {
    type: String
  },
  created_at: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset();
      }
    }
  },
  updated_at: {
    type: Date,
    autoValue: function () {
      if (this.isUpdate) {
        return new Date();
      }
    },
    optional: true
  }
});
Songs.attachSchema(SongsSchema);
module.exportDefault(Songs);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/db/songs/methods.js                                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Songs;
module.watch(require("./collection"), {
  default(v) {
    Songs = v;
  }

}, 0);
let Parties;
module.watch(require("../parties/collection"), {
  default(v) {
    Parties = v;
  }

}, 1);
Meteor.methods({
  'songs.add': (party_id, data) => {
    Songs.insert({
      user_id: Meteor.userId(),
      data: JSON.stringify(data),
      party_id,
      upvotes: [],
      downvotes: []
    });
  },
  'songs.setCurrent': (party_id, new_song_id) => {
    const currentSongId = Parties.findOne({
      _id: party_id
    }).current_song_id;
    if (currentSongId) Songs.remove({
      _id: currentSongId
    });
    Parties.update({
      _id: party_id
    }, {
      $set: {
        current_song_id: new_song_id
      }
    });
    console.log(`Playing song ${new_song_id} at party ${party_id}, removed song ${currentSongId}`);
  },
  'songs.remove': _id => {
    if (Parties.findOne({
      current_song_id: _id
    })) throw new Meteor.Error('remove', 'Cannot remove a song that is playing');
    Songs.remove({
      _id
    });
    console.log(`Song ${_id} removed`);
  },
  'songs.removeFromPlaying': _id => {
    const party = Parties.findOne({
      current_song_id: _id
    });

    if (party) {
      Songs.remove({
        _id
      });
      Parties.update({
        current_song_id: _id
      }, {
        $set: {
          current_song_id: 0
        }
      });
      console.log(`Song ${_id} removed, playing no song at party ${party._id}`);
    } else {
      throw new Meteor.Error('remove', 'Cannot remove a song from playing that is not playing');
    }
  },
  'songs.toggleVote': (isDownvote = false, _id) => {
    const songs = Songs.findOne({
      _id
    });
    const key = isDownvote ? 'downvotes' : 'upvotes';
    const keyInverse = isDownvote ? 'upvotes' : 'downvotes';

    if (songs[key].find(e => e === Meteor.userId())) {
      // remove from up/down votes
      Songs.update({
        _id
      }, {
        $pull: {
          [key]: Meteor.userId()
        }
      });
    } else {
      Songs.update({
        _id
      }, {
        $push: {
          [key]: Meteor.userId()
        }
      });
      Songs.update({
        _id
      }, {
        $pull: {
          [keyInverse]: Meteor.userId()
        }
      });
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"publications.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/db/songs/publications.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Songs;
module.watch(require("./collection"), {
  default(v) {
    Songs = v;
  }

}, 0);
Meteor.publish('songs', party_id => Songs.find({
  party_id
}));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"users":{"account-creation.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/db/users/account-creation.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let fs;
module.watch(require("fs"), {
  default(v) {
    fs = v;
  }

}, 0);
Accounts.onCreateUser((options, user) => {
  const {
    profile: {
      firstName,
      lastName
    }
  } = options;
  user.profile = {};
  user.profile.firstName = firstName;
  user.profile.lastName = lastName;
  user.profile.image = 'default-user-image.png';
  user.profile.settings = {};
  user.profile.settings.darkTheme = false;
  user.profile.settings.publicEmail = true;
  return user;
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"collection.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/db/users/collection.js                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
module.exportDefault(new Mongo.Collection('user'));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/db/users/methods.js                                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Parties;
module.watch(require("../parties/collection"), {
  default(v) {
    Parties = v;
  }

}, 0);
let Songs;
module.watch(require("../songs/collection"), {
  default(v) {
    Songs = v;
  }

}, 1);
Meteor.methods({
  'user.get': id => Meteor.users.findOne({
    _id: id
  }),
  'user.updateAccount': ({
    firstName,
    lastName,
    email,
    currentPassword,
    newPassword,
    confirmNewPassword
  }) => {
    if (currentPassword) {
      if (newPassword !== confirmNewPassword) throw new Meteor.Error('password', 'Passwords don\'t match!');
      if (Accounts._checkPassword(Meteor.user(), currentPassword)) Accounts.setPassword(Meteor.userId(), newPassword);
    }

    Meteor.users.update(Meteor.userId(), {
      $set: {
        'emails.0.address': email,
        'profile.firstName': firstName,
        'profile.lastName': lastName
      }
    });
  },
  'user.updateSettings': ({
    darkTheme,
    publicEmail
  }) => {
    Meteor.users.update(Meteor.userId(), {
      $set: {
        'profile.settings.darkTheme': darkTheme,
        'profile.settings.publicEmail': publicEmail
      }
    });
  },
  'user.removeAccount': () => {
    Parties.remove({
      user_id: Meteor.userId()
    });
    Parties.update({}, {
      $pull: {
        upvotes: Meteor.userId(),
        downvotes: Meteor.userId(),
        joined_users: {
          user_id: Meteor.userId()
        }
      }
    });
    Songs.remove({
      user_id: Meteor.userId()
    });
    Songs.update({}, {
      $pull: {
        upvotes: Meteor.userId(),
        downvotes: Meteor.userId()
      }
    });
    Meteor.users.remove({
      _id: Meteor.userId()
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"publications.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/db/users/publications.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('users', () => Meteor.users.find({}));
Meteor.publish('user', _id => Meteor.users.find({
  _id
}));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"startup":{"server":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/server/index.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.watch(require("/imports/db/users/collection"));
module.watch(require("/imports/db/users/publications"));
module.watch(require("/imports/db/users/methods"));
module.watch(require("/imports/db/users/account-creation"));
module.watch(require("/imports/db/parties/collection"));
module.watch(require("/imports/db/parties/methods"));
module.watch(require("/imports/db/parties/publications"));
module.watch(require("/imports/db/songs/collection"));
module.watch(require("/imports/db/songs/methods"));
module.watch(require("/imports/db/songs/publications"));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"server":{"main.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/main.js                                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
module.watch(require("/imports/startup/server/"));
Meteor.startup(() => {// code to run on server at startup
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9kYi9wYXJ0aWVzL2NvbGxlY3Rpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvZGIvcGFydGllcy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2RiL3BhcnRpZXMvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2RiL3NvbmdzL2NvbGxlY3Rpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvZGIvc29uZ3MvbWV0aG9kcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9kYi9zb25ncy9wdWJsaWNhdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvZGIvdXNlcnMvYWNjb3VudC1jcmVhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9kYi91c2Vycy9jb2xsZWN0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2RiL3VzZXJzL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvZGIvdXNlcnMvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2luZGV4LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJNb25nbyIsIm1vZHVsZSIsIndhdGNoIiwicmVxdWlyZSIsInYiLCJTaW1wbGVTY2hlbWEiLCJkZWZhdWx0IiwiUGFydGllcyIsIkNvbGxlY3Rpb24iLCJQYXJ0aWVzU2NoZW1hIiwidGl0bGUiLCJ0eXBlIiwiU3RyaW5nIiwibWF4IiwibWluIiwiZGVzY3JpcHRpb24iLCJnZW5yZSIsIkFycmF5IiwiTnVtYmVyIiwiY29sb3IiLCJzdGFydERhdGUiLCJEYXRlIiwiZW5kRGF0ZSIsInBhc3N3b3JkIiwidXNlcl9pZCIsImpvaW5lZF91c2VycyIsImN1cnJlbnRfc29uZ19pZCIsImRlZmF1bHRWYWx1ZSIsIk9iamVjdCIsImNyZWF0ZWRfYXQiLCJhdXRvVmFsdWUiLCJpc0luc2VydCIsImlzVXBzZXJ0IiwiJHNldE9uSW5zZXJ0IiwidW5zZXQiLCJ1cGRhdGVkX2F0IiwiaXNVcGRhdGUiLCJvcHRpb25hbCIsInVwdm90ZXMiLCJkb3dudm90ZXMiLCJhdHRhY2hTY2hlbWEiLCJleHBvcnREZWZhdWx0IiwiU29uZ3MiLCJNZXRlb3IiLCJtZXRob2RzIiwiZGF0YSIsInVzZXJJZCIsImRhdGUiLCJ2YWxpZGF0aW9uIiwic2ltcGxlU2NoZW1hIiwidmFsaWRhdGUiLCJlIiwiRXJyb3IiLCJtZXNzYWdlIiwiaW5zZXJ0IiwiZXJyb3IiLCJyZXN1bHQiLCJjb25zb2xlIiwibG9nIiwiaXNEb3dudm90ZSIsIl9pZCIsInBhcnR5IiwiZmluZE9uZSIsImtleSIsImtleUludmVyc2UiLCJmaW5kIiwidXBkYXRlIiwiJHB1bGwiLCIkcHVzaCIsInJlbW92ZSIsInBhcnR5X2lkIiwiJHNldCIsInB1Ymxpc2giLCJ1X2lkIiwiU29uZ3NTY2hlbWEiLCJKU09OIiwic3RyaW5naWZ5IiwibmV3X3NvbmdfaWQiLCJjdXJyZW50U29uZ0lkIiwic29uZ3MiLCJmcyIsIkFjY291bnRzIiwib25DcmVhdGVVc2VyIiwib3B0aW9ucyIsInVzZXIiLCJwcm9maWxlIiwiZmlyc3ROYW1lIiwibGFzdE5hbWUiLCJpbWFnZSIsInNldHRpbmdzIiwiZGFya1RoZW1lIiwicHVibGljRW1haWwiLCJpZCIsInVzZXJzIiwiZW1haWwiLCJjdXJyZW50UGFzc3dvcmQiLCJuZXdQYXNzd29yZCIsImNvbmZpcm1OZXdQYXNzd29yZCIsIl9jaGVja1Bhc3N3b3JkIiwic2V0UGFzc3dvcmQiLCJzdGFydHVwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLEtBQUo7QUFBVUMsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLGNBQVIsQ0FBYixFQUFxQztBQUFDSCxRQUFNSSxDQUFOLEVBQVE7QUFBQ0osWUFBTUksQ0FBTjtBQUFR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N0IsT0FBT2tELEtBQVAsQ0FBYTVCLElBQWIsQ0FBa0IsRUFBbEIsQ0FBOUI7QUFDQXRCLE9BQU82QixPQUFQLENBQWUsTUFBZixFQUF1QlosT0FBT2pCLE9BQU9rRCxLQUFQLENBQWE1QixJQUFiLENBQWtCO0FBQUNMO0FBQUQsQ0FBbEIsQ0FBOUIsRTs7Ozs7Ozs7Ozs7QUNEQTNELE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSw4QkFBUixDQUFiO0FBQXNERixPQUFPQyxLQUFQLENBQWFDLFFBQVEsZ0NBQVIsQ0FBYjtBQUF3REYsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLDJCQUFSLENBQWI7QUFBbURGLE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSxvQ0FBUixDQUFiO0FBQTRERixPQUFPQyxLQUFQLENBQWFDLFFBQVEsZ0NBQVIsQ0FBYjtBQUF3REYsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLDZCQUFSLENBQWI7QUFBcURGLE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSxrQ0FBUixDQUFiO0FBQTBERixPQUFPQyxLQUFQLENBQWFDLFFBQVEsOEJBQVIsQ0FBYjtBQUFzREYsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLDJCQUFSLENBQWI7QUFBbURGLE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSxnQ0FBUixDQUFiLEU7Ozs7Ozs7Ozs7O0FDQTdlLElBQUl3QyxNQUFKO0FBQVcxQyxPQUFPQyxLQUFQLENBQWFDLFFBQVEsZUFBUixDQUFiLEVBQXNDO0FBQUN3QyxTQUFPdkMsQ0FBUCxFQUFTO0FBQUN1QyxhQUFPdkMsQ0FBUDtBQUFTOztBQUFwQixDQUF0QyxFQUE0RCxDQUE1RDtBQUErREgsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLDBCQUFSLENBQWI7QUFHMUV3QyxPQUFPeUQsT0FBUCxDQUFlLE1BQU0sQ0FDbkI7QUFDRCxDQUZELEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY29uc3QgUGFydGllcyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdwYXJ0aWVzJyk7XG5cbmNvbnN0IFBhcnRpZXNTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICAvLyB1cmw6IHtcbiAgICAvLyAgICAgdHlwZTogU3RyaW5nLFxuICAgIC8vICAgICBtaW46IDIsXG4gICAgLy8gICAgIG1heDogMjAsXG4gICAgLy8gICAgIGluZGV4OiB0cnVlLFxuICAgIC8vICAgICB1bmlxdWU6IHRydWVcbiAgICAvLyB9LFxuICAgIHRpdGxlOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgbWF4OiAyMDAsXG4gICAgICAgIG1pbjogMyxcbiAgICB9LFxuICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgbWF4OiAyMDAwLFxuICAgIH0sXG4gICAgZ2VucmU6IHtcbiAgICAgICAgdHlwZTogQXJyYXksXG4gICAgfSxcbiAgICAnZ2VucmUuJCc6IHtcbiAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgIH0sXG4gICAgY29sb3I6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgIH0sXG4gICAgc3RhcnREYXRlOiB7XG4gICAgICAgIHR5cGU6IERhdGUsXG4gICAgfSxcbiAgICBlbmREYXRlOiB7XG4gICAgICAgIHR5cGU6IERhdGUsXG4gICAgfSxcbiAgICBwYXNzd29yZDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIG1pbjogMyxcbiAgICAgICAgbWF4OiAyMCxcbiAgICB9LFxuICAgIHVzZXJfaWQ6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgIH0sXG4gICAgam9pbmVkX3VzZXJzOiB7XG4gICAgICAgIHR5cGU6IEFycmF5LFxuICAgIH0sXG4gICAgY3VycmVudF9zb25nX2lkOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiAnJyxcbiAgICB9LFxuICAgICdqb2luZWRfdXNlcnMuJCc6IHtcbiAgICAgICAgdHlwZTogT2JqZWN0LFxuICAgIH0sXG4gICAgJ2pvaW5lZF91c2Vycy4kLnVzZXJfaWQnOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICB9LFxuICAgICdqb2luZWRfdXNlcnMuJC5kYXRlJzoge1xuICAgICAgICB0eXBlOiBEYXRlLFxuICAgIH0sXG4gICAgY3JlYXRlZF9hdDoge1xuICAgICAgICB0eXBlOiBEYXRlLFxuICAgICAgICBhdXRvVmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNJbnNlcnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc1Vwc2VydCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7JHNldE9uSW5zZXJ0OiBuZXcgRGF0ZSgpfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy51bnNldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH0sXG4gICAgdXBkYXRlZF9hdDoge1xuICAgICAgICB0eXBlOiBEYXRlLFxuICAgICAgICBhdXRvVmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICB9LFxuICAgIHVwdm90ZXM6IHtcbiAgICAgICAgdHlwZTogQXJyYXksXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogW11cbiAgICB9LFxuICAgICd1cHZvdGVzLiQnOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICB9LFxuICAgIGRvd252b3Rlczoge1xuICAgICAgICB0eXBlOiBBcnJheSxcbiAgICB9LFxuICAgICdkb3dudm90ZXMuJCc6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgIH1cbn0pO1xuUGFydGllcy5hdHRhY2hTY2hlbWEoUGFydGllc1NjaGVtYSk7XG5leHBvcnQgZGVmYXVsdCBQYXJ0aWVzOyIsImltcG9ydCBQYXJ0aWVzIGZyb20gJy4vY29sbGVjdGlvbic7XG5pbXBvcnQgU29uZ3MgZnJvbSAnLi4vc29uZ3MvY29sbGVjdGlvbic7XG5cbk1ldGVvci5tZXRob2RzKHtcbiAgICAncGFydGllcy5pbnNlcnQnOiAoeyB0aXRsZSwgZGVzY3JpcHRpb24sIGdlbnJlLCBzdGFydERhdGUsIGVuZERhdGUsIHBhc3N3b3JkLCBjb2xvciB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7IHRpdGxlLCBkZXNjcmlwdGlvbiwgZ2VucmUsIHN0YXJ0RGF0ZSwgZW5kRGF0ZSwgY3VycmVudF9zb25nX2lkOiAnJywgcGFzc3dvcmQsIGpvaW5lZF91c2VyczogW3t1c2VyX2lkOiBNZXRlb3IudXNlcklkKCksIGRhdGU6IG5ldyBEYXRlfV0sIHVzZXJfaWQ6IE1ldGVvci51c2VySWQoKSwgY3JlYXRlZF9hdDogbmV3IERhdGUsIHVwdm90ZXM6IFtdLCBkb3dudm90ZXM6IFtdLCBjb2xvciB9O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgdmFsaWRhdGlvbiA9IFBhcnRpZXMuc2ltcGxlU2NoZW1hKCkudmFsaWRhdGUoZGF0YSk7XG4gICAgICAgIH1jYXRjaChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCd2YWxpZGF0aW9uLWVycm9yJywgZS5tZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFBhcnRpZXMuaW5zZXJ0KGRhdGEsIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBpZihlcnJvcikgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYE5ldyBwYXJ0eSBjcmVhdGVkIHdpdGggaWQgXCIke3Jlc3VsdH1cImApO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgJ3BhcnRpZXMudG9nZ2xlVm90ZSc6IChpc0Rvd252b3RlID0gZmFsc2UsIF9pZCkgPT4ge1xuICAgICAgICBjb25zdCBwYXJ0eSA9IFBhcnRpZXMuZmluZE9uZSh7X2lkfSk7XG4gICAgICAgIGNvbnN0IGtleSA9IGlzRG93bnZvdGUgPyAnZG93bnZvdGVzJyA6ICd1cHZvdGVzJztcbiAgICAgICAgY29uc3Qga2V5SW52ZXJzZSA9IGlzRG93bnZvdGUgPyAndXB2b3RlcycgOiAnZG93bnZvdGVzJztcblxuICAgICAgICBpZihwYXJ0eVtrZXldLmZpbmQoZSA9PiBlID09PSBNZXRlb3IudXNlcklkKCkpKXsgLy8gcmVtb3ZlIGZyb20gdXAvZG93biB2b3Rlc1xuICAgICAgICAgICAgUGFydGllcy51cGRhdGUoe19pZH0sIHtcbiAgICAgICAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgICAgICAgICBba2V5XTogTWV0ZW9yLnVzZXJJZCgpLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUGFydGllcy51cGRhdGUoe19pZH0sIHtcbiAgICAgICAgICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICAgICAgICAgICBba2V5XTogTWV0ZW9yLnVzZXJJZCgpLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgUGFydGllcy51cGRhdGUoe19pZH0sIHtcbiAgICAgICAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgICAgICAgICBba2V5SW52ZXJzZV06IE1ldGVvci51c2VySWQoKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgJ3BhcnRpZXMudG9nZ2xlSm9pbic6IChfaWQsIHBhc3N3b3JkID0gbnVsbCkgPT4geyAvL3Bhc3N3b3JkIGlzIG9wdGlvbmFsLCBvbmx5IHVzZWQgYXQgam9pbmluZ1xuICAgICAgICBjb25zdCBwYXJ0eSA9IFBhcnRpZXMuZmluZE9uZSh7X2lkfSk7XG4gICAgICAgIGlmKHBhcnR5LmpvaW5lZF91c2Vycy5maW5kKGUgPT4gZS51c2VyX2lkID09PSBNZXRlb3IudXNlcklkKCkpKSB7XG4gICAgICAgICAgICBpZihNZXRlb3IudXNlcklkKCkgPT09IHBhcnR5LnVzZXJfaWQpIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ3BhcnR5LWxlYXZlJywgJ0Nhbm5vdCBsZWF2ZSBwYXJ0eSBpZiB5b3UgY3JlYXRlZCBpdCEnKTtcbiAgICAgICAgICAgIFBhcnRpZXMudXBkYXRlKHtfaWR9LCB7XG4gICAgICAgICAgICAgICAgJHB1bGw6IHtcbiAgICAgICAgICAgICAgICAgICAgam9pbmVkX3VzZXJzOiB7IHVzZXJfaWQgOiBNZXRlb3IudXNlcklkKCl9LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFVzZXIgJyR7TWV0ZW9yLnVzZXJJZCgpfScgbGVmdCBwYXJ0eSAnJHtwYXJ0eS5faWR9J2ApO1xuICAgICAgICB9IGVsc2UgaWYocGFydHkucGFzc3dvcmQgPT09IHBhc3N3b3JkKSB7XG4gICAgICAgICAgICBQYXJ0aWVzLnVwZGF0ZSh7X2lkfSwge1xuICAgICAgICAgICAgICAgICRwdXNoOiB7XG4gICAgICAgICAgICAgICAgICAgIGpvaW5lZF91c2VyczogeyB1c2VyX2lkOiBNZXRlb3IudXNlcklkKCksIGRhdGU6IG5ldyBEYXRlfSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBVc2VyICcke01ldGVvci51c2VySWQoKX0nIGpvaW5lZCBwYXJ0eSAnJHtwYXJ0eS5faWR9J2ApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1wYXJ0eS1wYXNzd29yZCcsICdXcm9uZyBwYXNzd29yZCEnKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgJ3BhcnRpZXMucmVtb3ZlJzogX2lkID0+e1xuICAgICAgICBjb25zdCBwYXJ0eSA9IFBhcnRpZXMuZmluZE9uZSh7X2lkfSk7XG4gICAgICAgIGlmKHBhcnR5LnVzZXJfaWQgPT09IE1ldGVvci51c2VySWQoKSkge1xuICAgICAgICAgICAgU29uZ3MucmVtb3ZlKHtwYXJ0eV9pZDogX2lkfSk7XG4gICAgICAgICAgICBQYXJ0aWVzLnJlbW92ZSh7X2lkfSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgVXNlciAnJHtNZXRlb3IudXNlcklkKCl9JyBkZWxldGVkIHBhcnR5ICcke3BhcnR5Ll9pZH0nYCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgICdwYXJ0aWVzLnVwZGF0ZSc6IChfaWQsIHsgdGl0bGUsIGRlc2NyaXB0aW9uLCBnZW5yZSwgc3RhcnREYXRlLCBlbmREYXRlLCBjb2xvciwgcGFzc3dvcmQsIH0pID0+IHtcbiAgICAgICAgUGFydGllcy51cGRhdGUoe19pZH0sIHsgJHNldDoge1xuICAgICAgICAgICAgdGl0bGUsIGRlc2NyaXB0aW9uLCBnZW5yZSwgc3RhcnREYXRlLCBlbmREYXRlLCBjb2xvciwgcGFzc3dvcmQsXG4gICAgICAgIH19KTtcbiAgICB9XG59KTsiLCJpbXBvcnQgUGFydGllcyBmcm9tICcuL2NvbGxlY3Rpb24nO1xuTWV0ZW9yLnB1Ymxpc2goJ3BhcnRpZXMnLCAoKSA9PiBQYXJ0aWVzLmZpbmQoe30pKTtcbk1ldGVvci5wdWJsaXNoKCdwYXJ0aWVzLmpvaW5lZCcsIHVfaWQgPT4gUGFydGllcy5maW5kKHt9KSk7IiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuXG5jb25zdCBTb25ncyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdzb25ncycpO1xuXG5jb25zdCBTb25nc1NjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgIHBhcnR5X2lkOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICB9LFxuICAgIHVzZXJfaWQ6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgIH0sXG4gICAgZGF0YToge1xuICAgICAgICB0eXBlOiBTdHJpbmcsIC8vSlNPTiBzdHJpbmdcbiAgICB9LFxuICAgIHVwdm90ZXM6IHtcbiAgICAgICAgdHlwZTogQXJyYXksXG4gICAgfSxcbiAgICAndXB2b3Rlcy4kJzoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgfSxcbiAgICBkb3dudm90ZXM6IHtcbiAgICAgICAgdHlwZTogQXJyYXksXG4gICAgfSxcbiAgICAnZG93bnZvdGVzLiQnOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICB9LFxuICAgIGNyZWF0ZWRfYXQ6IHtcbiAgICAgICAgdHlwZTogRGF0ZSxcbiAgICAgICAgYXV0b1ZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzSW5zZXJ0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNVcHNlcnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyRzZXRPbkluc2VydDogbmV3IERhdGUoKX07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudW5zZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHVwZGF0ZWRfYXQ6IHtcbiAgICAgICAgdHlwZTogRGF0ZSxcbiAgICAgICAgYXV0b1ZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgfSxcbn0pO1xuU29uZ3MuYXR0YWNoU2NoZW1hKFNvbmdzU2NoZW1hKTtcbmV4cG9ydCBkZWZhdWx0IFNvbmdzOyIsImltcG9ydCBTb25ncyBmcm9tICcuL2NvbGxlY3Rpb24nO1xuaW1wb3J0IFBhcnRpZXMgZnJvbSAnLi4vcGFydGllcy9jb2xsZWN0aW9uJztcblxuTWV0ZW9yLm1ldGhvZHMoe1xuICAgICdzb25ncy5hZGQnOiAocGFydHlfaWQsIGRhdGEpID0+IHtcbiAgICAgICAgU29uZ3MuaW5zZXJ0KHtcbiAgICAgICAgICAgIHVzZXJfaWQ6IE1ldGVvci51c2VySWQoKSxcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgcGFydHlfaWQsXG4gICAgICAgICAgICB1cHZvdGVzOiBbXSxcbiAgICAgICAgICAgIGRvd252b3RlczogW10sXG4gICAgICAgIH0pXG4gICAgfSxcbiAgICAnc29uZ3Muc2V0Q3VycmVudCc6IChwYXJ0eV9pZCwgbmV3X3NvbmdfaWQpID0+IHtcbiAgICAgICAgY29uc3QgY3VycmVudFNvbmdJZCA9IFBhcnRpZXMuZmluZE9uZSh7X2lkOiBwYXJ0eV9pZH0pLmN1cnJlbnRfc29uZ19pZDtcbiAgICAgICAgaWYoY3VycmVudFNvbmdJZCkgU29uZ3MucmVtb3ZlKHtfaWQ6IGN1cnJlbnRTb25nSWR9KTtcblxuICAgICAgICBQYXJ0aWVzLnVwZGF0ZSh7X2lkOiBwYXJ0eV9pZH0sIHskc2V0OiB7Y3VycmVudF9zb25nX2lkOiBuZXdfc29uZ19pZH19KTtcbiAgICAgICAgY29uc29sZS5sb2coYFBsYXlpbmcgc29uZyAke25ld19zb25nX2lkfSBhdCBwYXJ0eSAke3BhcnR5X2lkfSwgcmVtb3ZlZCBzb25nICR7Y3VycmVudFNvbmdJZH1gKVxuICAgIH0sXG4gICAgJ3NvbmdzLnJlbW92ZSc6IF9pZCA9PiB7XG4gICAgICAgIGlmKFBhcnRpZXMuZmluZE9uZSh7Y3VycmVudF9zb25nX2lkOiBfaWR9KSkgdGhyb3cgbmV3IE1ldGVvci5FcnJvcigncmVtb3ZlJywgJ0Nhbm5vdCByZW1vdmUgYSBzb25nIHRoYXQgaXMgcGxheWluZycpO1xuICAgICAgICBTb25ncy5yZW1vdmUoe19pZH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhgU29uZyAke19pZH0gcmVtb3ZlZGApO1xuICAgIH0sXG4gICAgJ3NvbmdzLnJlbW92ZUZyb21QbGF5aW5nJzogX2lkID0+IHtcbiAgICAgICAgY29uc3QgcGFydHkgPSBQYXJ0aWVzLmZpbmRPbmUoe2N1cnJlbnRfc29uZ19pZDogX2lkfSk7XG4gICAgICAgIGlmKHBhcnR5KSB7XG4gICAgICAgICAgICBTb25ncy5yZW1vdmUoe19pZH0pO1xuICAgICAgICAgICAgUGFydGllcy51cGRhdGUoe2N1cnJlbnRfc29uZ19pZDogX2lkfSwgeyRzZXQ6IHtjdXJyZW50X3NvbmdfaWQ6IDB9fSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgU29uZyAke19pZH0gcmVtb3ZlZCwgcGxheWluZyBubyBzb25nIGF0IHBhcnR5ICR7cGFydHkuX2lkfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcigncmVtb3ZlJywgJ0Nhbm5vdCByZW1vdmUgYSBzb25nIGZyb20gcGxheWluZyB0aGF0IGlzIG5vdCBwbGF5aW5nJyk7XG4gICAgICAgIH1cblxuICAgIH0sXG4gICAgJ3NvbmdzLnRvZ2dsZVZvdGUnOiAoaXNEb3dudm90ZSA9IGZhbHNlLCBfaWQpID0+IHtcbiAgICAgICAgY29uc3Qgc29uZ3MgPSBTb25ncy5maW5kT25lKHtfaWR9KTtcbiAgICAgICAgY29uc3Qga2V5ID0gaXNEb3dudm90ZSA/ICdkb3dudm90ZXMnIDogJ3Vwdm90ZXMnO1xuICAgICAgICBjb25zdCBrZXlJbnZlcnNlID0gaXNEb3dudm90ZSA/ICd1cHZvdGVzJyA6ICdkb3dudm90ZXMnO1xuXG4gICAgICAgIGlmKHNvbmdzW2tleV0uZmluZChlID0+IGUgPT09IE1ldGVvci51c2VySWQoKSkpeyAvLyByZW1vdmUgZnJvbSB1cC9kb3duIHZvdGVzXG4gICAgICAgICAgICBTb25ncy51cGRhdGUoe19pZH0sIHtcbiAgICAgICAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgICAgICAgICBba2V5XTogTWV0ZW9yLnVzZXJJZCgpLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgU29uZ3MudXBkYXRlKHtfaWR9LCB7XG4gICAgICAgICAgICAgICAgJHB1c2g6IHtcbiAgICAgICAgICAgICAgICAgICAgW2tleV06IE1ldGVvci51c2VySWQoKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFNvbmdzLnVwZGF0ZSh7X2lkfSwge1xuICAgICAgICAgICAgICAgICRwdWxsOiB7XG4gICAgICAgICAgICAgICAgICAgIFtrZXlJbnZlcnNlXTogTWV0ZW9yLnVzZXJJZCgpLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbn0pOyIsImltcG9ydCBTb25ncyBmcm9tICcuL2NvbGxlY3Rpb24nO1xuXG5NZXRlb3IucHVibGlzaCgnc29uZ3MnLCBwYXJ0eV9pZCA9PiBTb25ncy5maW5kKHsgcGFydHlfaWQgfSkpOyIsImltcG9ydCBmcyBmcm9tICdmcyc7XG5cbkFjY291bnRzLm9uQ3JlYXRlVXNlcigob3B0aW9ucywgdXNlcikgPT4ge1xuICAgIGNvbnN0IHsgcHJvZmlsZTogeyBmaXJzdE5hbWUsIGxhc3ROYW1lIH0gfSA9IG9wdGlvbnM7XG4gICAgdXNlci5wcm9maWxlID0ge307XG4gICAgdXNlci5wcm9maWxlLmZpcnN0TmFtZSA9IGZpcnN0TmFtZTtcbiAgICB1c2VyLnByb2ZpbGUubGFzdE5hbWUgPSBsYXN0TmFtZTtcbiAgICB1c2VyLnByb2ZpbGUuaW1hZ2UgPSAnZGVmYXVsdC11c2VyLWltYWdlLnBuZyc7XG4gICAgdXNlci5wcm9maWxlLnNldHRpbmdzID0ge307XG4gICAgdXNlci5wcm9maWxlLnNldHRpbmdzLmRhcmtUaGVtZSA9IGZhbHNlO1xuICAgIHVzZXIucHJvZmlsZS5zZXR0aW5ncy5wdWJsaWNFbWFpbCA9IHRydWU7XG4gICAgcmV0dXJuIHVzZXI7XG59KTsiLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBNb25nby5Db2xsZWN0aW9uKCd1c2VyJyk7IiwiaW1wb3J0IFBhcnRpZXMgZnJvbSAnLi4vcGFydGllcy9jb2xsZWN0aW9uJztcbmltcG9ydCBTb25ncyBmcm9tICcuLi9zb25ncy9jb2xsZWN0aW9uJztcblxuTWV0ZW9yLm1ldGhvZHMoe1xuICAgICd1c2VyLmdldCc6IGlkID0+IE1ldGVvci51c2Vycy5maW5kT25lKHtfaWQ6IGlkfSksXG4gICAgJ3VzZXIudXBkYXRlQWNjb3VudCc6ICh7IGZpcnN0TmFtZSwgbGFzdE5hbWUsIGVtYWlsLCBjdXJyZW50UGFzc3dvcmQsIG5ld1Bhc3N3b3JkLCBjb25maXJtTmV3UGFzc3dvcmQgfSkgPT4ge1xuICAgICAgICBpZihjdXJyZW50UGFzc3dvcmQpIHtcbiAgICAgICAgICAgIGlmKG5ld1Bhc3N3b3JkICE9PSBjb25maXJtTmV3UGFzc3dvcmQpIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ3Bhc3N3b3JkJywgJ1Bhc3N3b3JkcyBkb25cXCd0IG1hdGNoIScpO1xuICAgICAgICAgICAgaWYoQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQoTWV0ZW9yLnVzZXIoKSwgY3VycmVudFBhc3N3b3JkKSlcbiAgICAgICAgICAgICAgICBBY2NvdW50cy5zZXRQYXNzd29yZChNZXRlb3IudXNlcklkKCksIG5ld1Bhc3N3b3JkKTtcblxuICAgICAgICB9XG4gICAgICAgIE1ldGVvci51c2Vycy51cGRhdGUoTWV0ZW9yLnVzZXJJZCgpLCB7JHNldDoge1xuICAgICAgICAgICAgJ2VtYWlscy4wLmFkZHJlc3MnOiBlbWFpbCxcbiAgICAgICAgICAgICdwcm9maWxlLmZpcnN0TmFtZSc6IGZpcnN0TmFtZSxcbiAgICAgICAgICAgICdwcm9maWxlLmxhc3ROYW1lJzogbGFzdE5hbWVcbiAgICAgICAgfX0pO1xuICAgIH0sXG4gICAgJ3VzZXIudXBkYXRlU2V0dGluZ3MnOiAoeyBkYXJrVGhlbWUsIHB1YmxpY0VtYWlsIH0pID0+IHtcbiAgICAgICAgTWV0ZW9yLnVzZXJzLnVwZGF0ZShNZXRlb3IudXNlcklkKCksIHskc2V0OiB7XG4gICAgICAgICAgICAncHJvZmlsZS5zZXR0aW5ncy5kYXJrVGhlbWUnOiBkYXJrVGhlbWUsXG4gICAgICAgICAgICAncHJvZmlsZS5zZXR0aW5ncy5wdWJsaWNFbWFpbCc6IHB1YmxpY0VtYWlsXG4gICAgICAgIH19KTtcbiAgICB9LFxuICAgICd1c2VyLnJlbW92ZUFjY291bnQnOiAoKSA9PiB7XG4gICAgICAgIFBhcnRpZXMucmVtb3ZlKHt1c2VyX2lkOiBNZXRlb3IudXNlcklkKCl9KTtcbiAgICAgICAgUGFydGllcy51cGRhdGUoe30sIHtcbiAgICAgICAgICAgICRwdWxsOiB7XG4gICAgICAgICAgICAgICAgdXB2b3RlczogTWV0ZW9yLnVzZXJJZCgpLFxuICAgICAgICAgICAgICAgIGRvd252b3RlczogTWV0ZW9yLnVzZXJJZCgpLFxuICAgICAgICAgICAgICAgIGpvaW5lZF91c2VyczogeyB1c2VyX2lkIDogTWV0ZW9yLnVzZXJJZCgpIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBTb25ncy5yZW1vdmUoe3VzZXJfaWQ6IE1ldGVvci51c2VySWQoKX0pO1xuICAgICAgICBTb25ncy51cGRhdGUoe30sIHtcbiAgICAgICAgICAgICRwdWxsOiB7XG4gICAgICAgICAgICAgICAgdXB2b3RlczogTWV0ZW9yLnVzZXJJZCgpLFxuICAgICAgICAgICAgICAgIGRvd252b3RlczogTWV0ZW9yLnVzZXJJZCgpLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgTWV0ZW9yLnVzZXJzLnJlbW92ZSh7X2lkOiBNZXRlb3IudXNlcklkKCl9KTtcbiAgICB9LFxufSk7XG4iLCJNZXRlb3IucHVibGlzaCgndXNlcnMnLCAoKSA9PiBNZXRlb3IudXNlcnMuZmluZCh7fSkpO1xuTWV0ZW9yLnB1Ymxpc2goJ3VzZXInLCBfaWQgPT4gTWV0ZW9yLnVzZXJzLmZpbmQoe19pZH0pKTsiLCJpbXBvcnQgJy9pbXBvcnRzL2RiL3VzZXJzL2NvbGxlY3Rpb24nO1xuaW1wb3J0ICcvaW1wb3J0cy9kYi91c2Vycy9wdWJsaWNhdGlvbnMnO1xuaW1wb3J0ICcvaW1wb3J0cy9kYi91c2Vycy9tZXRob2RzJztcbmltcG9ydCAnL2ltcG9ydHMvZGIvdXNlcnMvYWNjb3VudC1jcmVhdGlvbic7XG5pbXBvcnQgJy9pbXBvcnRzL2RiL3BhcnRpZXMvY29sbGVjdGlvbic7XG5pbXBvcnQgJy9pbXBvcnRzL2RiL3BhcnRpZXMvbWV0aG9kcyc7XG5pbXBvcnQgJy9pbXBvcnRzL2RiL3BhcnRpZXMvcHVibGljYXRpb25zJztcbmltcG9ydCAnL2ltcG9ydHMvZGIvc29uZ3MvY29sbGVjdGlvbic7XG5pbXBvcnQgJy9pbXBvcnRzL2RiL3NvbmdzL21ldGhvZHMnO1xuaW1wb3J0ICcvaW1wb3J0cy9kYi9zb25ncy9wdWJsaWNhdGlvbnMnO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgJy9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyLyc7XG5cbk1ldGVvci5zdGFydHVwKCgpID0+IHtcbiAgLy8gY29kZSB0byBydW4gb24gc2VydmVyIGF0IHN0YXJ0dXBcbn0pO1xuIl19

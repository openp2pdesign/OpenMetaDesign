Meteor.publish('projects', function(userId) {
    return Projects.find({createdBy: userId});
});

Meteor.publish('usersList', function() {
    return Meteor.users.find({}, {
        fields: {
            'emails': 1,
            'username': 1,
            'profile.firstName': 1,
            'profile.lastName': 1,
            'profile.bio': 1
        }
    });
});

Meteor.publishComposite("tabular_users", function (tableName, ids, fields) {
  check(tableName, String);
  check(ids, Array);
  check(fields, Match.Optional(Object));

  this.unblock(); // requires meteorhacks:unblock package

  return {
    find: function () {
      this.unblock(); // requires meteorhacks:unblock package

      return Meteor.users.find({}, {
            fields: {
                'emails': 1,
                'username': 1,
                'roles': 1,
                'profile.firstName': 1,
                'profile.lastName': 1,
                'profile.bio': 1
            }
        });
    },
  };
});


Meteor.publish('settings', function () {
  return Settings.find();
});

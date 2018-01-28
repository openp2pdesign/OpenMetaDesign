import { Projects } from '../lib/collections/projects.js';
import { Settings } from '../lib/collections/settings.js';
import { Activities } from '../lib/collections/activities.js';
import { ActivityElements } from '../lib/collections/activity_elements.js';
// Keep this commented, or flows won't be found in Tabular
//import { Flows } from '../lib/collections/flows.js';


// Publish users
Meteor.publish('projects', function(userId) {
    return Projects.find();
});

// Publish users
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

// Publish users, for the tabular
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

// Publish flows, for the tabular
Meteor.publishComposite("tabular_flows", function (tableName, ids, fields) {
  check(tableName, String);
  check(ids, Array);
  check(fields, Match.Optional(Object));

  this.unblock(); // requires meteorhacks:unblock package

  return {
    find: function () {
      this.unblock(); // requires meteorhacks:unblock package

      return Flows.find({}, {
            fields: {
                'id': 1,
                'flowData.title': 1
            }
        });
    },
  };
});

// Publish settings for the whole app
Meteor.publish('settings', function () {
  return Settings.find();
});

// Publish activities for the whole app
Meteor.publish('activities', function() {
    return Activities.find();
});

// Publish activity elements for the whole app
Meteor.publish('activityElements', function() {
    return ActivityElements.find();
});

// Publish flows for the whole app
Meteor.publish('flows', function() {
    return Flows.find();
});

// Publish projects for autocomplete forms
Meteor.publish("autocompleteProjects", function(selector, options) {
  Autocomplete.publishCursor(Projects.find(selector, options), this);
  this.ready();
});

// Publish users for autocomplete forms
Meteor.publish("autocompleteUsers", function(selector, options) {
  Autocomplete.publishCursor(Meteor.users.find(selector, options), this);
  this.ready();
});

// Publish activities for autocomplete forms
Meteor.publish("autocompleteActivities", function(selector, options) {
  Autocomplete.publishCursor(Activities.find(selector, options), this);
  this.ready();
});

// Publish activity elements for autocomplete forms
Meteor.publish("autocompleteActivityElements", function(selector, options) {
  Autocomplete.publishCursor(ActivityElements.find(selector, options), this);
  this.ready();
});

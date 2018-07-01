import { Random } from 'meteor/random';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

SimpleSchema.debug = true;

// Collection of Projects where users are invited
export const InvitedUsersToProjects = new Mongo.Collection('invited_users_to_projects');


if (Meteor.isServer) {
  InvitedUsersToProjects.allow({
    insert: function (userId, doc) {
      return false;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return false;
    },

    remove: function (userId, doc) {
      return false;
    }
  });

  InvitedUsersToProjects.deny({
    insert: function (userId, doc) {
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return true;
    }
  });
}

// A schema for invited users to projects
InvitedUsersSchema = new SimpleSchema({
    projectId: {
        type: String,
    },
    text: {
        type: String,
        optional: true
    },
    users: {
        type: Array,
        optional: true
    },
    'users.$': {
        type: Object,
        blackbox: true
    },
});

// Attach the InvitedUsersSchema to the Flows collection
InvitedUsersToProjects.attachSchema(InvitedUsersSchema);

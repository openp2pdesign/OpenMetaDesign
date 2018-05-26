import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// Collection of Comment Project Statistics
export const CommentStats = new Mongo.Collection('commentstats');


if (Meteor.isServer) {
  CommentStats.allow({
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

  CommentStats.deny({
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

// A schema for a single date data
export const DateDataSchema = new SimpleSchema({
    projectId: {
        type: String,
    },
    date: {
        type: Date
    },
    value: {
        type: Number
    }
});

// Attach the DateDataSchema to the CommentStats collection
CommentStats.attachSchema(DateDataSchema);

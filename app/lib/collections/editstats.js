import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// Collection of Edit Project Statistics
export const EditStats = new Mongo.Collection('editstats');


if (Meteor.isServer) {
  EditStats.allow({
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

  EditStats.deny({
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

// Attach the DateDataSchema to the EditStats collection
EditStats.attachSchema(DateDataSchema);

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import ActivityElementSchema from './projects.js';

SimpleSchema.debug = true;

// Collection of Activity Elements, for the autocomplete
export const ActivityElements = new Mongo.Collection('activityelements');


if (Meteor.isServer) {
  ActivityElements.allow({
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

  ActivityElements.deny({
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


// A schema for an activity element, for the autocomplete
ActivityElementAutocompleteSchema = new SimpleSchema({
    activityElementId: {
        type: String,
    },
    activityId: {
        type: String,
    },
    processId: {
        type: String,
    },
    projectId: {
        type: String,
    },
    activityElementData: {
        type: ActivityElementSchema
    }
});

// Attach the ActivityElementAutocompleteSchema to the ActivityElements collection
ActivityElements.attachSchema(ActivityElementAutocompleteSchema);

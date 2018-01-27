import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { ActivitySchema } from './projects';

SimpleSchema.debug = true;

// Collection of Activities, for the autocomplete
export const Activities = new Mongo.Collection('activities');


if (Meteor.isServer) {
    Activities.allow({
        insert: function(userId, doc) {
            return false;
        },

        update: function(userId, doc, fieldNames, modifier) {
            return false;
        },

        remove: function(userId, doc) {
            return false;
        }
    });
}

if (Meteor.isClient) {
    Activities.allow({
        insert: function(userId, doc) {
            return true;
        },

        update: function(userId, doc, fieldNames, modifier) {
            return true;
        },

        remove: function(userId, doc) {
            return true;
        }
    });
}

// A schema for an activity for the autocomplete
ActivityAutocompleteSchema = new SimpleSchema({
    activityId: {
        type: String,
    },
    processId: {
        type: String,
    },
    projectId: {
        type: String,
    },
    activityData: {
        type: ActivitySchema
    }
});

// Attach the ActivityAutocompleteSchema to the Activities collection
Activities.attachSchema(ActivityAutocompleteSchema);
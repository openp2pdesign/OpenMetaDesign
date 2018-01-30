import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { ActivitySchema } from './projects';
import { ActivityElementSchema } from './projects';

SimpleSchema.debug = true;

// Collection of Activity Elements, for the autocomplete
export const ActivityElements = new Mongo.Collection('activityelements');


if (Meteor.isServer) {
    ActivityElements.allow({
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
    ActivityElements.allow({
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

// A schema for an activity element
ActivityElementSeparateSchema = new SimpleSchema({
    projectId: {
        type: String,
    },
    processId: {
        type: String,
    },
    activityId: {
        type: String,
    },
    activityData: {
        type: ActivitySchema
    },
    activityElementId: {
        type: String,
    },
    activityElementData: {
        type: ActivityElementSchema
    }
});

// Attach the ActivityElementSeparateSchema to the ActivityElements collection
ActivityElements.attachSchema(ActivityElementSeparateSchema);

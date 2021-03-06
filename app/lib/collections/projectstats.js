import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// Collection of Project Statistics
export const ProjectStats = new Mongo.Collection('projectstats');


if (Meteor.isServer) {
    ProjectStats.allow({
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
    ProjectStats.allow({
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

// A schema for a single date data
export const DateDataSchema = new SimpleSchema({
    date: {
        type: Date
    },
    value: {
        type: Number
    }
});

// A schema for a single stat
export const StatSchema = new SimpleSchema({
    topicName: {
        type: String
    },
    topic: {
        type: Number
    },
    dates: {
        type: Array,
        optional: true
    },
    'dates.$': {
        type: DateDataSchema
    },
});

// A schema for all the stats
export const CompleteStatSchema = new SimpleSchema({
    projectId: {
        type: String,
    },
    dataByTopic: {
        type: Array,
        optional: true
    },
    'dataByTopic.$': {
        type: StatSchema
    },
});

// Attach the CompleteStatSchema to the ProjectStats collection
ProjectStats.attachSchema(CompleteStatSchema);

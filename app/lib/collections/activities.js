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
ActivitySeparateSchema = new SimpleSchema({
    projectId: {
        type: String,
    },
    processId: {
        type: String,
    },
    activityData: {
        type: ActivitySchema
    },
    createdBy: {
        type: String,
        autoValue: function() {
            var createdByUser = Meteor.users.findOne({
                _id: this.userId
            });
            return createdByUser.username;
        }
    },
    createdByID: {
        type: String,
        autoValue: function() {
            return this.userId;
        }
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            }
        }
    },
    lastUpdatedAt: {
        type: Date,
        autoValue: function() {
            return new Date();
        }
    },
    lastUpdatedBy: {
        type: String,
        autoValue: function() {
            var updatedByUser = Meteor.users.findOne({
                _id: this.userId
            });
            return updatedByUser.username;
        }
    },
    lastUpdatedByID: {
        type: String,
        autoValue: function() {
            return this.userId;
        }
    },
});

// Attach the ActivitySeparateSchema to the Activities collection
Activities.attachSchema(ActivitySeparateSchema);

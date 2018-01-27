import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { FlowSchema } from './projects';

Flows = new Mongo.Collection('flows');


if (Meteor.isServer) {
    Flows.allow({
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
    Flows.allow({
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

// A schema for flows
FlowsSeparateSchema = new SimpleSchema({
    projectId: {
        type: String,
    },
    flowId: {
        type: String,
    },
    flowData: {
        type: FlowSchema
    }
});

// Attach the FlowSeparateSchema to the Flows collection
Flows.attachSchema(FlowsSeparateSchema);

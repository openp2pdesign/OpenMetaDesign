import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { ContradictionSchema } from './projects';

Contradictions = new Mongo.Collection('contradictions');


if (Meteor.isServer) {
    Contradictions.allow({
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
    Contradictions.allow({
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

// A schema for contradictions
ContradictionsSeparateSchema = new SimpleSchema({
    projectId: {
        type: String,
    },
    contradictionId: {
        type: String,
    },
    contradictionData: {
        type: ContradictionSchema
    }
});

// Attach the ContradictionsSeparateSchema to the Contradictions collection
Contradictions.attachSchema(ContradictionsSeparateSchema);

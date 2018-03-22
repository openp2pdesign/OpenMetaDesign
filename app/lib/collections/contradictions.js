import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { ContradictionSchema } from './projects';

export const Contradictions = new Mongo.Collection('contradictions');


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
    contradictionData: {
        type: ContradictionSchema
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

// Attach the ContradictionsSeparateSchema to the Contradictions collection
Contradictions.attachSchema(ContradictionsSeparateSchema);

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { SimpleChat } from 'meteor/cesarve:simple-chat2/config'

SimpleSchema.debug = true;


// Collection of Discussions
export const Discussions = new Mongo.Collection('discussions');


if (Meteor.isServer) {
  Discussions.allow({
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

  Discussions.deny({
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

// A schema for a comment
export const CommentSchema = new SimpleSchema({
    id: {
        type: String
    },
    body: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdByID: {
        type: String
    },
    createdAt: {
        type: Date
    },
    roomId: {
        type: String
    }
});

// A schema for discussions
export const DiscussionSchema = new SimpleSchema({
    attachedTo: {
        type: String
    },
    comments: {
        type: Array,
    },
    'comments.$': CommentSchema
});

// Attach the DiscussionSchema to the Discussion collection
Discussions.attachSchema(DiscussionSchema);

// Configure Simple Chat
SimpleChat.configure ({
    texts:{
        loadMore: 'Load More',
        placeholder: '...',
        button: '+',
    },
    beep: true,
    showViewed: true,
    showReceived: true,
    showJoined: true,
    publishChats: function (roomId, limit) {
        return true;
    },
    onNewMessage: function(msg) {
        // Format a message as a comment
        var newComment = {
            "id": msg._id,
            "body": msg.message,
            "createdBy": msg.username,
            "createdByID": msg.userId,
            "createdAt": msg.date,
            "roomId": msg.roomId
        }
        console.log(newMessage);
    }
});

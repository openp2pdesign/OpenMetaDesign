import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { SimpleChat } from 'meteor/openp2pdesign:simple-chat/config'
import { CommentSchema } from './projects';
import { DiscussionSchema } from './projects';

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



// Attach the DiscussionSchema to the Discussion collection
Discussions.attachSchema(DiscussionSchema);

// Configure Simple Chat
SimpleChat.configure ({
    texts:{
        loadMore: 'Load More',
        placeholder: '...',
        button: '+',
        join: 'Join to',
        left: 'Left the',
        room: 'room at'
    },
    beep: true,
    showViewed: true,
    showReceived: true,
    showJoined: true,
    publishChats: function (roomId, limit) {
        return true;
    },
    onNewMessage: function(msg) {
        console.log(msg);
        // Format a message as a comment
        var newComment = {
            "id": msg._id,
            "body": msg.message,
            "createdBy": msg.username,
            "createdByID": msg.userId,
            "createdAt": msg.date,
            "roomId": msg.roomId
        }
        // Get the project and the element commented from the roomId
        var thisProjectId = msg.roomId.split("-")[0];
        var thisElementId = msg.roomId.split("-")[1];
    },
    onJoin:function(roomId, username, name,date){  //server
    },
    onLeft:function(roomId, username, name,date) { //server
    },

});

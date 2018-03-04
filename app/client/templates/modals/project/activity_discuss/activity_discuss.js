/*****************************************************************************/
/* ActivityDiscuss: Event Handlers */
/*****************************************************************************/
Template.ActivityDiscuss.events({
});

/*****************************************************************************/
/* ActivityDiscuss: Helpers */
/*****************************************************************************/
Template.ActivityDiscuss.helpers({
    thisRoomId: function() {
        return thisProject._id + '-' + thisActivity.id;
    },
    thisUsername: function() {
        return Meteor.user().username;
    },
    thisName: function() {
        var name = Meteor.user().profile.firstName + ' ' + Meteor.user().profile.lastName;
        return name;
    },
    thisGravatar: function() {
        return Meteor.user().profile.avatar;
    }
});

/*****************************************************************************/
/* ActivityDiscuss: Lifecycle Hooks */
/*****************************************************************************/
Template.ActivityDiscuss.onCreated(function () {
});

Template.ActivityDiscuss.onRendered(function () {
});

Template.ActivityDiscuss.onDestroyed(function () {
});

/*****************************************************************************/
/* ProjectDiscussionViz: Event Handlers */
/*****************************************************************************/
Template.ProjectDiscussionViz.events({
});

/*****************************************************************************/
/* ProjectDiscussionViz: Helpers */
/*****************************************************************************/
Template.ProjectDiscussionViz.helpers({
    thisRoomId: function() {
        if (typeof Session.get('discussionToShow') !== "undefined") {
            return Session.get('discussionToShow');
        }
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
    },
});

/*****************************************************************************/
/* ProjectDiscussionViz: Lifecycle Hooks */
/*****************************************************************************/
Template.ProjectDiscussionViz.onCreated(function () {
});

Template.ProjectDiscussionViz.onRendered(function () {
});

Template.ProjectDiscussionViz.onDestroyed(function () {
});

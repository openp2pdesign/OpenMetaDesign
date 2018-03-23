/*****************************************************************************/
/* Discuss: Event Handlers */
/*****************************************************************************/
Template.Discuss.events({
});

/*****************************************************************************/
/* Discuss: Helpers */
/*****************************************************************************/
Template.Discuss.helpers({
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
/* Discuss: Lifecycle Hooks */
/*****************************************************************************/
Template.Discuss.onCreated(function () {
});

Template.Discuss.onRendered(function () {
});

Template.Discuss.onDestroyed(function () {
});

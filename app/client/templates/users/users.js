/*****************************************************************************/
/* Users: Event Handlers */
/*****************************************************************************/
Template.Users.events({});

/*****************************************************************************/
/* Users: Helpers */
/*****************************************************************************/
Template.Users.helpers({
    users: function() {
        return Meteor.users.find();
    }
});

/*****************************************************************************/
/* Users: Lifecycle Hooks */
/*****************************************************************************/
Template.Users.onCreated(function() {
    Meteor.subscribe('usersList');
});

Template.Users.onRendered(function() {});

Template.Users.onDestroyed(function() {});

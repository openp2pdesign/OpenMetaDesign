/*****************************************************************************/
/* ActivityDiscuss: Event Handlers */
/*****************************************************************************/
Template.ActivityDiscuss.events({
});

/*****************************************************************************/
/* ActivityDiscuss: Helpers */
/*****************************************************************************/
Template.ActivityDiscuss.helpers({
    data: function() {
        // Return helper values for the template
        return {
            "project": thisProject,
            "process": this.process,
            "activity": thisActivity
        }
    },
    thisUsername: function() {
        return Meteor.user().profile.name;
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

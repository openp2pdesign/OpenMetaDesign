/*****************************************************************************/
/* ActivityDiscuss: Event Handlers */
/*****************************************************************************/
Template.ActivityDiscuss.events({
});

/*****************************************************************************/
/* ActivityDiscuss: Helpers */
/*****************************************************************************/
Template.ActivityDiscuss.helpers({
});

/*****************************************************************************/
/* ActivityDiscuss: Lifecycle Hooks */
/*****************************************************************************/
Template.ActivityDiscuss.onCreated(function () {
    Session.get('discussionToShow');
});

Template.ActivityDiscuss.onRendered(function () {
});

Template.ActivityDiscuss.onDestroyed(function () {
});

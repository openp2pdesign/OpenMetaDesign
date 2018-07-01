/*****************************************************************************/
/* JoinProject: Event Handlers */
/*****************************************************************************/
Template.JoinProject.events({
    'click .edit-project': function() {
        Router.go("projectsViz", this);
    },
});

/*****************************************************************************/
/* JoinProject: Helpers */
/*****************************************************************************/
Template.JoinProject.helpers({
});

/*****************************************************************************/
/* JoinProject: Lifecycle Hooks */
/*****************************************************************************/
Template.JoinProject.onCreated(function () {
});

Template.JoinProject.onRendered(function () {
});

Template.JoinProject.onDestroyed(function () {
});

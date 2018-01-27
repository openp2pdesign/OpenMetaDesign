/*****************************************************************************/
/* EditProject: Event Handlers */
/*****************************************************************************/

Template.EditProject.events({
    'click .edit-project': function() {
        Router.go("projectsViz", this);
    },
    'click .delete-project': function() {
        Modal.show('ConfirmProjectDelete', this);
    }
});

/*****************************************************************************/
/* EditProject: Helpers */
/*****************************************************************************/
Template.EditProject.helpers({
});

/*****************************************************************************/
/* EditProject: Lifecycle Hooks */
/*****************************************************************************/
Template.EditProject.onCreated(function () {
});

Template.EditProject.onRendered(function () {
});

Template.EditProject.onDestroyed(function () {
});

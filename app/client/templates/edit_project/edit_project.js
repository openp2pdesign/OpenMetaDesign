/*****************************************************************************/
/* EditProject: Event Handlers */
/*****************************************************************************/

// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";

Template.EditProject.events({
    'click .edit-project': function() {
        Modal.show('ProjectEdit', this);
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

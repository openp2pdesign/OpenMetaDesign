// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";
/*****************************************************************************/
/* ActivityDelete: Event Handlers */
/*****************************************************************************/
Template.ActivityDelete.events({
    'click #delete-activity-button': function(event) {
        event.preventDefault();
        Meteor.call('deleteActivity', this.project._id, this.process.id, this.activity.id, function(error, result) {
            if (error) {
                var errorNotice = new PNotify({
                    type: 'error',
                    title: 'Error',
                    text: 'There was an error in deleting the activity',
                    icon: 'fa fa-random',
                    addclass: 'pnotify stack-topright',
                    animate: {
                        animate: true,
                        in_class: 'slideInDown',
                        out_class: 'slideOutUp'
                    },
                    buttons: {
                        closer: true,
                        sticker: false
                    }
                });

                errorNotice.get().click(function() {
                    errorNotice.remove();
                });
            } else {
                // Close the modal, since there is no activity any longer
                Modal.hide('Activity');
                var successNotice = new PNotify({
                    type: 'success',
                    title: 'Success',
                    text: 'Activity successfully deleted.',
                    icon: 'fa fa-randoms',
                    addclass: 'pnotify stack-topright',
                    animate: {
                        animate: true,
                        in_class: 'slideInDown',
                        out_class: 'slideOutUp'
                    },
                    buttons: {
                        closer: true,
                        sticker: false
                    }
                });

                successNotice.get().click(function() {
                    successNotice.remove();
                });
            }
        });
    },
    'click #cancel-delete-activity-button': function(event) {
        event.preventDefault();
        $('.nav-tabs a[href="#activity-view-tab"]').tab('show');
    }
});

/*****************************************************************************/
/* ActivityDelete: Helpers */
/*****************************************************************************/
Template.ActivityDelete.helpers({
    data: function() {
        // Return helper values for the template
        return {
            "project": thisProject,
            "process": this.process,
            "activity": thisActivity
        }
    }
});

/*****************************************************************************/
/* ActivityDelete: Lifecycle Hooks */
/*****************************************************************************/
Template.ActivityDelete.onCreated(function() {});

Template.ActivityDelete.onRendered(function() {});

Template.ActivityDelete.onDestroyed(function() {});

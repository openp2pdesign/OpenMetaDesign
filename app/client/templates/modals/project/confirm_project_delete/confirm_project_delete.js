/*****************************************************************************/
/* ConfirmProjectDelete: Event Handlers */
/*****************************************************************************/

// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";

Template.ConfirmProjectDelete.events({
    'click #confirm': function() {
        Meteor.call('deleteProject', this._id, function(error, result) {
            if (error) {
                var errorNotice = new PNotify({
                    type: 'error',
                    title: 'Error',
                    text: 'There was an error in deleting the project',
                    icon: 'fa fa-cube',
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
                var successNotice = new PNotify({
                    type: 'success',
                    title: 'Success',
                    text: 'Project successfully deleted.',
                    icon: 'fa fa-cube',
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
    }
});

/*****************************************************************************/
/* ConfirmProjectDelete: Helpers */
/*****************************************************************************/
Template.ConfirmProjectDelete.helpers({
    data: function() {
        return this;
    }
});

/*****************************************************************************/
/* ConfirmProjectDelete: Lifecycle Hooks */
/*****************************************************************************/
Template.ConfirmProjectDelete.onCreated(function() {});

Template.ConfirmProjectDelete.onRendered(function() {});

Template.ConfirmProjectDelete.onDestroyed(function() {});

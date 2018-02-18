/*****************************************************************************/
/* ConfirmUserDelete: Event Handlers */
/*****************************************************************************/

// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";

Template.ConfirmUserDelete.events({
    'click #confirm': function() {
        Meteor.call('deleteUser', this._id);

        var successNotice = new PNotify({
            type: 'success',
            title: 'Success',
            text: 'The user was deleted.',
            icon: 'fa fa-user',
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

/*****************************************************************************/
/* ConfirmUserDelete: Helpers */
/*****************************************************************************/
Template.ConfirmUserDelete.helpers({
    data: function() {
        return this;
    }
});

/*****************************************************************************/
/* ConfirmUserDelete: Lifecycle Hooks */
/*****************************************************************************/
Template.ConfirmUserDelete.onCreated(function () {
});

Template.ConfirmUserDelete.onRendered(function () {
});

Template.ConfirmUserDelete.onDestroyed(function () {
});

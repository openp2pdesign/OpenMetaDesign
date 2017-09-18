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
        Meteor.call('removeProject', this._id);

        var successNotice = new PNotify({
            type: 'success',
            title: 'Success',
            text: 'The project was deleted.',
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
Template.ConfirmProjectDelete.onCreated(function () {
});

Template.ConfirmProjectDelete.onRendered(function () {
});

Template.ConfirmProjectDelete.onDestroyed(function () {
});

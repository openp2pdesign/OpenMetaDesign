/*****************************************************************************/
/* editUser: Event Handlers */
/*****************************************************************************/

// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";

Template.editUser.events({
    'click .edit-user': function() {
        Modal.show('UserProfileEdit', this);
    },
    'click .edit-admin': function() {
        if (Roles.userIsInRole(this, 'admin')) {
            Meteor.call('removeAdmin', this._id);

            var successNotice = new PNotify({
                type: 'success',
                title: 'Success',
                text: 'The user is not admin anymore.',
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

        } else {
            Meteor.call('addAdmin', this._id);

            var successNotice = new PNotify({
                type: 'success',
                title: 'Success',
                text: 'The user is admin.',
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
    },
    'click .change-password': function() {
        Modal.show('ChangePassword', this);
    },
    'click .delete-user': function() {
        Modal.show('ConfirmUserDelete', this);
    }
});

/*****************************************************************************/
/* editUser: Helpers */
/*****************************************************************************/
Template.editUser.helpers({});

/*****************************************************************************/
/* editUser: Lifecycle Hooks */
/*****************************************************************************/
Template.editUser.onCreated(function() {});

Template.editUser.onRendered(function() {});

Template.editUser.onDestroyed(function() {});

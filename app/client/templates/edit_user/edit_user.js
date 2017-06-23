/*****************************************************************************/
/* editUser: Event Handlers */
/*****************************************************************************/

Template.editUser.events({
    'click .edit-user': function() {
        Modal.show('UserProfileEdit', this);
    },
    'click .edit-admin': function() {
        if (Roles.userIsInRole(this, 'admin')) {
            Meteor.call('removeAdmin', this._id);
        } else {
            Meteor.call('addAdmin', this._id);
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

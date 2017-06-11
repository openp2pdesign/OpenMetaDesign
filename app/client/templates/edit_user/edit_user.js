/*****************************************************************************/
/* editUser: Event Handlers */
/*****************************************************************************/

Template.editUser.events({
    'click .edit-user': function() {
        console.log("edit", this._id);
        Modal.show('UserProfileEdit', this);
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

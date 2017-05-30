/*****************************************************************************/
/* editUser: Event Handlers */
/*****************************************************************************/
Template.editUser.events({
    'click .edit-user': function() {
        console.log("edit", this._id);
    },
    'click .delete-user': function() {
        console.log("delete", this._id);
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

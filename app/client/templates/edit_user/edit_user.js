/*****************************************************************************/
/* editUser: Event Handlers */
/*****************************************************************************/

userToBeDeleted = "";

Template.editUser.events({
    'click .edit-user': function() {
        console.log("edit", this._id);
    },
    'click .delete-user': function() {
        userToBeDeleted = this._id;
        Modal.show('confirmUserDelete', this);
    }
});

Template.confirmUserDelete.events({
    'click #confirm': function() {
        Meteor.users.remove({
            _id: this._id
        }, function(error, result) {
            if (error) {
                console.log("Error removing user: ", error);
            } else {
                console.log("Number of users removed: " + result);
            }
        })
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

/*****************************************************************************/
/* editUser: Event Handlers */
/*****************************************************************************/
Template.editUser.events({
    'click .edit-user': function() {
        console.log("edit", this._id);
    },
    'click .delete-user': function() {
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

/*****************************************************************************/
/* ConfirmUserDelete: Event Handlers */
/*****************************************************************************/
Template.ConfirmUserDelete.events({
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

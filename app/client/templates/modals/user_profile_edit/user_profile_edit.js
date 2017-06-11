/*****************************************************************************/
/* UserProfileEdit: Event Handlers */
/*****************************************************************************/
Template.UserProfileEdit.events({
    'click #confirm': function(event) {
        event.preventDefault();
        var newUsername = $('#new-username').val();
        var newFirstName = $('#new-firstname').val();
        var newLastname = $('#new-lastname').val();
        var newEmail = $('#new-email').val();
        var newBio = $('#new-bio').val();
        var newPassword = $('#new-password').val();

        // Validate username, e-mail and password

        // Save new data


        // Meteor.users.update(Meteor.userId(), {
        //     $set: {
        //         profile: data
        //     }
        // });

    }
});

/*****************************************************************************/
/* UserProfileEdit: Helpers */
/*****************************************************************************/
Template.UserProfileEdit.helpers({
    data: function() {
        return this;
    }
});

/*****************************************************************************/
/* UserProfileEdit: Lifecycle Hooks */
/*****************************************************************************/
Template.UserProfileEdit.onCreated(function() {});

Template.UserProfileEdit.onRendered(function() {});

Template.UserProfileEdit.onDestroyed(function() {});

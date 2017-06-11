/*****************************************************************************/
/* UserProfileEdit: Event Handlers */
/*****************************************************************************/
Template.UserProfileEdit.events({
    'click #confirm': function(event) {
        event.preventDefault();
        var newUsername = $('#new-username').val();
        var newFirstName = $('#new-firstname').val();
        var newLastName = $('#new-lastname').val();
        var newEmail = $('#new-email').val();
        var newBio = $('#new-bio').val();

        // Validate and save new data

        if (newFirstName) {
            Meteor.users.update({
                _id: Meteor.userId()
            }, {
                $set: {
                    "profile.firstName": newFirstName
                }
            });
        }
        if (newLastName) {
            Meteor.users.update({
                _id: Meteor.userId()
            }, {
                $set: {
                    "profile.lastName": newLastName
                }
            });
        }
        if (newBio) {
            Meteor.users.update({
                _id: Meteor.userId()
            }, {
                $set: {
                    "profile.bio": newBio
                }
            });
        }
        if ((newEmail) && (validateEmail(newEmail))) {
            Meteor.users.update({
                _id: Meteor.userId()
            }, {
                $set: {
                    "emails.0.address": newEmail
                }
            });
        }

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

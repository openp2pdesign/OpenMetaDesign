// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";
// jquery
import { $ } from 'meteor/jquery';

/*****************************************************************************/
/* InviteUsersToProject: Event Handlers */
/*****************************************************************************/
Template.InviteUsersToProject.events({
        'click #confirm': function() {
            event.preventDefault();
            // Get the data from the form
            var newInvitedUsers = $('#invite-users-autocomplete').val();
            // Split the data by @
            newInvitedUsers = newInvitedUsers.split("@");
            newInvitedUsersArray = [];
            // Remove empty spaces
            for (str in newInvitedUsers) {
                newInvitedUsersArray.push($.trim(newInvitedUsers[str]));
            }
            // Remove empty usernames
            for (element in newInvitedUsersArray) {
                if (newInvitedUsersArray[element].length == 0) {
                    newInvitedUsersArray.splice(element,1);
                }
            }
            console.log("Invited:", newInvitedUsersArray);
        }
});

/*****************************************************************************/
/* InviteUsersToProject: Helpers */
/*****************************************************************************/
Template.InviteUsersToProject.helpers({
    autocompleteSettingsInvitedUser: function() {
        return {
            position: "bottom",
            limit: 8,
            rules: [{
                    token: '@',
                    collection: Meteor.users,
                    field: "username",
                    template: Template.UserPill,
                    noMatchTemplate: Template.NotFoundPill
                },
            ]
        };
    },
});

/*****************************************************************************/
/* InviteUsersToProject: Lifecycle Hooks */
/*****************************************************************************/
Template.InviteUsersToProject.onCreated(function () {
    //Meteor.subscribe("usersList");
});

Template.InviteUsersToProject.onRendered(function () {
});

Template.InviteUsersToProject.onDestroyed(function () {
});

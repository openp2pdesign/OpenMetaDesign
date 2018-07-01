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
            // Update the document
            Meteor.call("updateInvitedUsersToProject", this._id, newInvitedUsersArray, function(error, result) {
                if (error) {
                    var errorNotice = new PNotify({
                        type: 'error',
                        title: 'Error',
                        text: 'There was an error in inviting users',
                        icon: 'fa fa-user-plus',
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
                    errorNotice.get().click(function() {
                        errorNotice.remove();
                    });
                } else {
                    var successNotice = new PNotify({
                        type: 'success',
                        title: 'Success',
                        text: 'Users successfully invited.',
                        icon: 'fa fa-user-plus',
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
            });
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

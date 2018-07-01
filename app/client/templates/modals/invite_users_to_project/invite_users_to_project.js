// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";

/*****************************************************************************/
/* InviteUsersToProject: Event Handlers */
/*****************************************************************************/
Template.InviteUsersToProject.events({
        'click #confirm': function() {
            event.preventDefault();
            console.log("confirmed");
        }
});

/*****************************************************************************/
/* InviteUsersToProject: Helpers */
/*****************************************************************************/
Template.InviteUsersToProject.helpers({
    autocompleteSettingsUser: function() {
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
});

Template.InviteUsersToProject.onRendered(function () {
});

Template.InviteUsersToProject.onDestroyed(function () {
});

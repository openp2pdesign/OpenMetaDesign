// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";
// jquery
import { $ } from 'meteor/jquery';

// Import collection
import { InvitedUsersToProjects } from '../../../../lib/collections/invited_users_to_projects.js';

/*****************************************************************************/
/* InviteUsersToProject: Event Handlers */
/*****************************************************************************/
Template.InviteUsersToProject.events({
        'click #confirm': function() {
            event.preventDefault();
            // Get the data from the form
            var newInvitedUsersValues = $('#new-users-invited').select2('data');
            var newInvitedUsersArray = [];
            for (user in newInvitedUsersValues) {
                newInvitedUsersArray.push(newInvitedUsersValues[user].id);
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
    data: function() {
        if ( Meteor.subscribe("invitedUsersToProjects").ready()) {
            var thisDoc = InvitedUsersToProjects.findOne({ 'projectId' : thisProjectID });
            return thisDoc;
        }
    },
    allUsers: function() {
        return Meteor.users.find().fetch();
    },
});

/*****************************************************************************/
/* InviteUsersToProject: Lifecycle Hooks */
/*****************************************************************************/
Template.InviteUsersToProject.onCreated(function () {
    Meteor.subscribe("usersList");
    thisProjectID = this.data._id;
});

Template.InviteUsersToProject.onRendered(function () {
    // Icons for select2 options
    function optionFormatIcon(icon) {
        var originalOption = icon.element;
        return '<i class="' + $(originalOption).data('icon') + '"></i> ' + icon.text;
    }
    // Enable select2
    $('.select2-dropdown').select2({
        dropdownAutoWidth: true,
        width: '100%',
        templateSelection: optionFormatIcon,
        templateResult: optionFormatIcon,
        allowHtml: true,
        escapeMarkup: function(m) {
            return m;
        }
    });
});

Template.InviteUsersToProject.onDestroyed(function () {
});

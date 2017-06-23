/*****************************************************************************/
/* UserProfileEdit: Event Handlers */
/*****************************************************************************/

// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";

Template.UserProfileEdit.events({
    'click #confirm': function(event) {
        event.preventDefault();
        var newUsername = $('#new-username').val();
        var newFirstName = $('#new-firstname').val();
        var newLastName = $('#new-lastname').val();
        var newEmail = $('#new-email').val();
        var newBio = $('#new-bio').val();


        // Validate and save new data

        if ((newFirstName) && (newFirstName != Meteor.user().profile.firstName)) {
            Meteor.users.update({
                _id: Meteor.userId()
            }, {
                $set: {
                    "profile.firstName": newFirstName
                }
            });
            var successNotice = new PNotify({
                type: 'success',
                title: 'Success',
                text: 'The name of the user was successfully updated.',
                icon: 'fa fa-user',
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

        if ((newLastName) && (newLastName != Meteor.user().profile.lastName)) {
            Meteor.users.update({
                _id: Meteor.userId()
            }, {
                $set: {
                    "profile.lastName": newLastName
                }
            });
            var successNotice = new PNotify({
                type: 'success',
                title: 'Success',
                text: 'The surname of the user was successfully updated.',
                icon: 'fa fa-user',
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

        if ((newBio) && (newBio != Meteor.user().profile.bio)) {
            Meteor.users.update({
                _id: Meteor.userId()
            }, {
                $set: {
                    "profile.bio": newBio
                }
            });
            var successNotice = new PNotify({
                type: 'success',
                title: 'Success',
                text: 'The bio of the user was successfully updated.',
                icon: 'fa fa-user',
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

        if ((newEmail) && (newEmail != Meteor.user().emails[0].address)) {
            if (validateEmail(newEmail)) {
                Meteor.users.update({
                    _id: Meteor.userId()
                }, {
                    $set: {
                        "emails.0.address": newEmail
                    }
                });
                var successNotice = new PNotify({
                    type: 'success',
                    title: 'Success',
                    text: 'The e-mail of the user was successfully updated.',
                    icon: 'fa fa-user',
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
            } else {
                var errorNotice = new PNotify({
                    type: 'error',
                    title: 'Error',
                    text: 'There was a problem with the e-mail.',
                    icon: 'fa fa-exclamation-triangle',
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
            }
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

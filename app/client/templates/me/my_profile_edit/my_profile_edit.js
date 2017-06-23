/*****************************************************************************/
/* MyProfileEdit: Event Handlers */
/*****************************************************************************/

// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";

Template.MyProfileEdit.events({
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
                text: 'Your name was successfully updated.',
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
                text: 'Your surname was successfully updated.',
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
                text: 'Your bio was successfully updated.',
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
                    text: 'Your e-mail was successfully updated.',
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
                    text: 'There was a problem with your e-mail.',
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
/* MyProfileEdit: Helpers */
/*****************************************************************************/
Template.MyProfileEdit.helpers({
    currentUserData: function() {
        return Meteor.user();
    }
});

/*****************************************************************************/
/* MyProfileEdit: Lifecycle Hooks */
/*****************************************************************************/
Template.MyProfileEdit.onCreated(function() {});

Template.MyProfileEdit.onRendered(function() {});

Template.MyProfileEdit.onDestroyed(function() {});

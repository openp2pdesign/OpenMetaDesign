// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";
// jquery
import { $ } from 'meteor/jquery';

/*****************************************************************************/
/* Me: Event Handlers */
/*****************************************************************************/
Template.Me.events({
    'click .edit-user': function() {
        Modal.show('MyProfileEdit', this);
    },
    'click .change-password': function() {
        Modal.show('ChangePassword', this);
    },
});

/*****************************************************************************/
/* Me: Helpers */
/*****************************************************************************/
Template.Me.helpers({
    currentUserData: function() {
        return Meteor.user();
    },
});

/*****************************************************************************/
/* Me: Lifecycle Hooks */
/*****************************************************************************/
Template.Me.onCreated(function() {});

Template.Me.onRendered(function() {});

Template.Me.onDestroyed(function() {});

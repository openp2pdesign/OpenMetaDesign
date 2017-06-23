/*****************************************************************************/
/* EditRole: Event Handlers */
/*****************************************************************************/

// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";

Template.EditRole.events({
    'click #confirm': function(event) {
        event.preventDefault();
        var newRole = $('#roleEdit input:radio:checked').val();

        if (newRole !== undefined) {
            Roles.addUsersToRoles(this._id, newRole);
        }



    }
});

/*****************************************************************************/
/* EditRole: Helpers */
/*****************************************************************************/
Template.EditRole.helpers({
    data: function() {
        return this;
    }
});

/*****************************************************************************/
/* EditRole: Lifecycle Hooks */
/*****************************************************************************/
Template.EditRole.onCreated(function () {
});

Template.EditRole.onRendered(function () {
});

Template.EditRole.onDestroyed(function () {
});

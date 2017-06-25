/*****************************************************************************/
/* Admin: Event Handlers */
/*****************************************************************************/

// Access settings
Meteor.subscribe('settings');

// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";

Template.Admin.events({
    'click #google-maps-api-key-confirm': function(event) {
        event.preventDefault();

        var newGoogleMapsAPIKey = $('#new-google-maps-api-key').val();
        Meteor.call('updateGoogleMapsSettings', this._id, newGoogleMapsAPIKey);

        var successNotice = new PNotify({
            type: 'success',
            title: 'Success',
            text: 'Your Google Maps API key were successfully updated.',
            icon: 'fa fa-key',
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

/*****************************************************************************/
/* Admin: Helpers */
/*****************************************************************************/
Template.Admin.helpers({
    settingsData: function() {
        return Settings.findOne();
    }
});

/*****************************************************************************/
/* Admin: Lifecycle Hooks */
/*****************************************************************************/
Template.Admin.onCreated(function() {});

Template.Admin.onRendered(function() {});

Template.Admin.onDestroyed(function() {});

// Setup of tabular for this template
import {
    $
} from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
dataTablesBootstrap(window, $);

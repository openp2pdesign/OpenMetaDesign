// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";
// jquery
import { $ } from 'meteor/jquery';
// Load Projects and Settings
import { Projects } from '../../../../../lib/collections/projects.js';
import { Settings } from '../../../../../lib/collections/settings.js';

/*****************************************************************************/
/* ActivityLocation: Event Handlers */
/*****************************************************************************/
Template.ActivityLocation.events({
    'click #save-location-button': function(event) {
        event.preventDefault();
        // Load data from the form
        var thisActivityId = $('#activity-id').data('id');
        var thisActivityNumber = $('#activity-number').data('id');
        var newStreet = $('#new-street').val();
        var newNumber = $('#new-number').val();
        var newPostalCode = $('#new-postalcode').val();
        var newCity = $('#new-city').val();
        var newCountry = $('#new-country').val();
        var newLink = $('#new-link').val();

        // Format data from the form as an object
        locationData = {
            "street": newStreet,
            "number": Number(newNumber),
            "postalcode": newPostalCode,
            "city": newCity,
            "country": newCountry,
            "url": newLink,
        }

        // Update the data
        Meteor.call('editActivityLocation', this.project._id, this.process.id, thisActivityId, locationData, function(error, result) {
            if (error) {
                var errorNotice = new PNotify({
                    type: 'error',
                    title: 'Error',
                    text: 'There was an error in editing the activity',
                    icon: 'icomoon-activity',
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
                    text: 'Activity successfully edited.',
                    icon: 'icomoon-activity',
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
/* ActivityLocation: Helpers */
/*****************************************************************************/
Template.ActivityLocation.helpers({
    data: function() {
        // Return helper values for the template
        return {
            "project": thisProject,
            "process": thisProcess,
            "activity": thisActivity
        }
    }
});

/*****************************************************************************/
/* ActivityLocation: Lifecycle Hooks */
/*****************************************************************************/
Template.ActivityLocation.onCreated(function() {
    // Access projects
    self.subscription = Meteor.subscribe('projects');
    // Load contents (already loaded in activity.js)
    thisProject = this.data.project;
    thisProcess = this.data.process;
    thisActivity = this.data.activity;
});

Template.ActivityLocation.onRendered(function() {});

Template.ActivityLocation.onDestroyed(function() {});

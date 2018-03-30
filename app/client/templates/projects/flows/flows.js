// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";
// jquery
import { $ } from 'meteor/jquery';
// Load Projects and Settings
import { Projects } from '../../../../lib/collections/projects.js';
import { Settings } from '../../../../lib/collections/settings.js';
import { Activities } from '../../../../lib/collections/activities.js';
import { Flows } from '../../../../lib/collections/flows.js';

/*****************************************************************************/
/* Flows: Event Handlers */
/*****************************************************************************/
Template.Flows.events({
    // Show the div that enable the creation of flows
    'click #create-flow-button': function(event, template) {
        event.preventDefault();
        // Launch the modal
        Modal.show('Flow', function() {
            return {
                "projectId": thisProjectID,
                "flowId": 'new flow',
                "mode": "add"
            }
        });
    },
});

/*****************************************************************************/
/* Flows: Helpers */
/*****************************************************************************/
Template.Flows.helpers({
    tabularSelector: function() {
        return {'projectId': this._id};
    }
});

/*****************************************************************************/
/* Flows: Lifecycle Hooks */
/*****************************************************************************/
Template.Flows.onCreated(function() {
    Meteor.subscribe('projects');
    Meteor.subscribe('activities');
    Meteor.subscribe('flows');
    // Get project ID
    thisProjectID = this.data._id;
});

Template.Flows.onRendered(function() {
    // Make the table responsive
    $("table.reactive-table").wrap("<div class='table table-responsive'></div>");
});

Template.Flows.onDestroyed(function() {});

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
import { Contradictions } from '../../../../lib/collections/contradictions.js';

/*****************************************************************************/
/* Contradictions: Event Handlers */
/*****************************************************************************/
Template.Contradictions.events({
    // Show the div that enable the creation of contradictions
    'click #create-contradiction-button': function(event, template) {
        event.preventDefault();
        // Launch the modal
        Modal.show('Contradiction', function() {
            return {
                "projectId": thisProjectID,
                "contradictionId": 'new contradiction',
                "mode": "add"
            }
        });
    },
});

/*****************************************************************************/
/* Contradictions: Helpers */
/*****************************************************************************/
Template.Contradictions.helpers({
    tabularSelector: function() {
        return {'projectId': this._id};
    }
});

/*****************************************************************************/
/* Contradictions: Lifecycle Hooks */
/*****************************************************************************/
Template.Contradictions.onCreated(function() {
    Meteor.subscribe('projects');
    Meteor.subscribe('activities');
    Meteor.subscribe('contradictions');
    // Get project ID
    thisProjectID = this.data._id;
});

Template.Contradictions.onRendered(function() {
    // Make the table responsive
    $("table.reactive-table").wrap("<div class='table table-responsive'></div>");
});

Template.Contradictions.onDestroyed(function() {});

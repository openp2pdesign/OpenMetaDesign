// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";
// jquery
import { $ } from 'meteor/jquery';
// Random id
import { Random } from 'meteor/random';
// Load Projects and Settings
import { Projects } from '../../../../../lib/collections/projects.js';
import { Settings } from '../../../../../lib/collections/settings.js';
import { Activities } from '../../../../../lib/collections/activities.js';
import { Flows } from '../../../../../lib/collections/flows.js';

/*****************************************************************************/
/* Flow: Event Handlers */
/*****************************************************************************/
Template.Flow.events({
});
/*****************************************************************************/
/* Flow: Helpers */
/*****************************************************************************/
Template.Flow.helpers({
    activities: function() {
        // Return only the activities in the current project
        return Activities.find({
            'projectId': this._id
        }).fetch();
    },
    activityElements: function() {
        // Return only the activity elements in the current project
        return ActivityElements.find({
            'projectId': this._id
        }).fetch();
    },
    flowData: function() {
        // Get the flow data
        var thisData = Flows.findOne({
            '_id': this.flowId
        });
        // If there is data... then return it
        if (thisData) {
            // Add the data for the nodes
            thisData.firstNodeData = Activities.findOne({
                '_id': thisData.flowData.firstNode
            });
            thisData.secondNodeData = Activities.findOne({
                '_id': thisData.flowData.secondNode
            });
            // Return the data
            return thisData;
        }
    },
});

/*****************************************************************************/
/* Flow: Lifecycle Hooks */
/*****************************************************************************/
Template.Flow.onCreated(function() {
    Meteor.subscribe('projects');
    Meteor.subscribe('activities');
    Meteor.subscribe('flows');
});

Template.Flow.onRendered(function() {
    // Add tooltip to the tabs
    $('[data-toggle="tab"]').tooltip({
        trigger: 'hover',
        placement: 'top'
    });
    // Enable select2
    $('.select2-dropdown').select2({
        dropdownAutoWidth: true,
        width: '100%'
    });
});

Template.Flow.onDestroyed(function() {});

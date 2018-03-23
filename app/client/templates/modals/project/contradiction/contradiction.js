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
import { ActivityElements } from '../../../../../lib/collections/activity_elements.js';
import { Contradictions } from '../../../../../lib/collections/contradictions.js';

// Client only collection for the autocomplete
LocalActivityElements = new Mongo.Collection(null);

/*****************************************************************************/
/* Contradiction: Event Handlers */
/*****************************************************************************/
Template.Contradiction.events({
});

/*****************************************************************************/
/* Contradiction: Helpers */
/*****************************************************************************/
Template.Contradiction.helpers({
    activities: function() {
        // Return only the activities in the current project
        return Activities.find({ 'projectId': this._id }).fetch();
    },
    activityElements: function() {
        // Return only the activity elements in the current project
        return ActivityElements.find({ 'projectId': this._id }).fetch();
    },
    contradictionData: function() {
        // Get the contradiction data
        var thisData = Contradictions.findOne({
            '_id': this.contradictionId
        });
        // If there is data... then return it
        if (thisData) {
            // Add the data for the nodes
            thisData.firstNodeData = Activities.findOne({
                '_id': thisData.contradictionData.firstNode
            });
            thisData.secondNodeData = Activities.findOne({
                '_id': thisData.contradictionData.secondNode
            });
            // Return the data
            return thisData;
        }
    },
});

/*****************************************************************************/
/* Contradiction: Lifecycle Hooks */
/*****************************************************************************/
Template.Contradiction.onCreated(function () {
    Meteor.subscribe('projects');
    Meteor.subscribe('activities');
    Meteor.subscribe('activityElements');
    Meteor.subscribe('contradictions');
});

Template.Contradiction.onRendered(function () {
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

Template.Contradiction.onDestroyed(function () {
});

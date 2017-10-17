/*****************************************************************************/
/* ProjectsViz: Event Handlers */
/*****************************************************************************/

import openmetadesign_viz from './openmetadesign.js';
import { Session } from 'meteor/session';
import { Projects } from '../../../../lib/collections/projects.js';
import { Settings } from '../../../../lib/collections/settings.js';


Template.ProjectsViz.events({
    'click .activity-button': function() {
        event.preventDefault();

        event.path.map( function(item) {
            // Check the data embedded in the button
            dataActivityMode = $(item).attr("data-activity-mode");
            dataProcessId = $(item).attr("data-process-id");
            dataActivityId = $(item).attr("data-activity-id");

            if (dataActivityMode == "edit") {
                // Edit button
                Modal.show('Activity', function () {
                    return { "project": thisProject._id,
                    "process": dataProcessId,
                    "activity": dataActivityId,
                    "mode": "edit" }
                });
            } else if (dataActivityMode == "add") {
                // Add button
                Modal.show('Activity', function () {
                    return { "project": thisProject._id,
                    "process": dataProcessId,
                    "activity": dataActivityId,
                    "mode": "add" }
                });
            }
        });
    },
    'click .discuss-button': function() {
        event.preventDefault();
        Modal.show('ActivityDiscuss');
    },
    'click .flows-button': function() {
        event.preventDefault();
        Modal.show('ActivityFlows');
    },
    'click .issues-button': function() {
        event.preventDefault();
        Modal.show('ActivityIssues');
    },
    'click .delete-button': function() {
        event.preventDefault();

        event.path.map( function(item) {
            // Check the data embedded in the button
            dataActivityId = $(item).attr("data-activity-id");
            // If there's an activity id, delete it
            if (dataActivityId) {
                Modal.show('ActivityDelete', function () {
                    return { "project": thisProject._id,
                    "activity": dataActivityId }
                });
            }
        });
    },
    'click .svg-emoji': function() {
        Modal.show('ActivityAdd');
    },
});

/*****************************************************************************/
/* ProjectsViz: Helpers */
/*****************************************************************************/
Template.ProjectsViz.helpers({
    data: function() {
        return thisProject;
    }
});

/*****************************************************************************/
/* ProjectsViz: Lifecycle Hooks */
/*****************************************************************************/
Template.ProjectsViz.onCreated(function() {
    // Access this specific project
    self.subscription = Meteor.subscribe('projects');
    thisProject = this.data;

    // Access settings
    // Subscriptions take time, so check when it's ready
    self.subscription = Meteor.subscribe('settings');
    Tracker.autorun(function() {
        if (self.subscription.ready()) {
            var myset = Settings.findOne();
            GoogleMaps.load({
                key: myset.GoogleMapsAPIkey,
                libraries: 'places'
            });
        }
    });
});

Template.ProjectsViz.onRendered(function() {
    Tracker.autorun(function() {
        // Reactive var for the autorun
        var thisUpdatedProject = Projects.findOne({_id: thisProject._id });

        // Visualize this project
        openmetadesign_viz(thisUpdatedProject);
        // Add tooltips to the visualization
        this.$('svg .button-tooltip').tooltip({
            container: 'body',
            trigger: "hover",
            placement: 'top'
        });
    });
});

Template.ProjectsViz.onDestroyed(function() {});

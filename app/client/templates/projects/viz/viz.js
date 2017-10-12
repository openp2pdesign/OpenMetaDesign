/*****************************************************************************/
/* ProjectsViz: Event Handlers */
/*****************************************************************************/

import openmetadesign_viz from './openmetadesign.js';
import { Session } from 'meteor/session';
import { Projects } from '../../../../lib/collections/projects.js';
import { Settings } from '../../../../lib/collections/settings.js';


Template.ProjectsViz.events({
    'click .edit-button': function() {
        event.preventDefault();
        console.log("vizthis",this);
        // TODO id of the process and of the activity
        Modal.show('Activity', function () {
            return {
                "project": thisProject._id,
                "process": thisProject.processes[0], // TODO id of the process
                "activity": "edit", // TODO id of the activity
                "mode": "edit" }
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
        Modal.show('ActivityDelete', function () {
            return { "project": thisProject._id,
            "activity": "add" } // TODO id of the activity
        });
    },
    'click #add-activity-0': function() {
        event.preventDefault();
        Modal.show('Activity', function () {
            return { "project": thisProject._id,
            "process": thisProject.processes[0],
            "activity": "add",
            "mode": "add" }
        });
    },
    'click #add-activity-1': function() {
        event.preventDefault();
        Modal.show('Activity', function () {
            return { "project": thisProject._id,
            "process": thisProject.processes[1],
            "activity": "add",
            "mode": "add" }
        });
    },
    'click #add-activity-2': function() {
        event.preventDefault();
        Modal.show('Activity', function () {
            return { "project": thisProject._id,
            "process": thisProject.processes[2],
            "activity": "add",
            "mode": "add" }
        });
    },
    'click #add-activity-3': function() {
        event.preventDefault();
        Modal.show('Activity', function () {
            return { "project": thisProject._id,
            "process": thisProject.processes[3],
            "activity": "add",
            "mode": "add" }
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
        // Visualize this project
        openmetadesign_viz(thisProject);
        // Add tooltips to the visualization
        this.$('svg .button-tooltip').tooltip({
            container: 'body',
            trigger: "hover",
            placement: 'top'
        });
    });
});

Template.ProjectsViz.onDestroyed(function() {});

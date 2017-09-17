/*****************************************************************************/
/* ProjectsViz: Event Handlers */
/*****************************************************************************/

import openmetadesign_viz from './openmetadesign.js';
import { Session } from 'meteor/session';

Template.ProjectsViz.events({
    'click .edit-button': function() {
        Modal.show('ActivityEdit');
    },
    'click .discuss-button': function() {
        Modal.show('ActivityDiscuss');
    },
    'click .flows-button': function() {
        Modal.show('ActivityFlows');
    },
    'click .issues-button': function() {
        Modal.show('ActivityIssues');
    },
    'click .delete-button': function() {
        Modal.show('ActivityDelete');
    },
    'click .activity-add-button': function() {
        Modal.show('ActivityAdd');
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
        return this;
    }
});

/*****************************************************************************/
/* ProjectsViz: Lifecycle Hooks */
/*****************************************************************************/
Template.ProjectsViz.onCreated(function() {
    // Access projects
    self.subscription = Meteor.subscribe('projects');

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

    // Create an empty project
    defaultEmptyProject = {
        title: "Title of the project",
        description: "Description of the project",
        version: "0.1",
        founders: ["..."],
        processes: ["..."],
    }
    Session.set("defaultEmptyProject", defaultEmptyProject);
    // Projects.insert({
    //     title: "Title of the project",
    //     description: "Description of the project",
    //     version: "0.1",
    //     founders: ["..."],
    //     processes: ["..."],
    // }, (error, result) => {
    //
    // });
});

Template.ProjectsViz.onRendered(function() {
    Tracker.autorun(function() {
        // Visualize the project
        openmetadesign_viz();
        // Add tooltips to the visualization
        this.$('svg .button-tooltip').tooltip({
            container: 'body',
            trigger: "hover",
            placement: 'top'
        });
    });
});

Template.ProjectsViz.onDestroyed(function() {});

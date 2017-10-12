/*****************************************************************************/
/* ProjectsViz: Event Handlers */
/*****************************************************************************/

import openmetadesign_viz from './openmetadesign.js';
import { Session } from 'meteor/session';
import { Projects } from '../../../../lib/collections/projects.js';
import { Settings } from '../../../../lib/collections/settings.js';


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
    'click #add-activity-0': function() {
        event.preventDefault();
        
        Modal.show('ActivityAdd', function () {
            return { "id": thisProject._id, "process": thisProject.processes[0] }
        });
    },
    'click #add-activity-1': function() {
        console.log("Adding an activity to 1", this.processes[1]);
        Modal.show('ActivityAdd', this);
    },
    'click #add-activity-2': function() {
        console.log("Adding an activity to 2", this.processes[2]);
        Modal.show('ActivityAdd', this);
    },
    'click #add-activity-3': function() {
        console.log("Adding an activity to 3", this.processes[0]);
        Modal.show('ActivityAdd', this);
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
    // Access projects
    self.subscription = Meteor.subscribe('projects');

    // Access this specific project
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

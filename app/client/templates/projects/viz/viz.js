/*****************************************************************************/
/* ProjectsViz: Event Handlers */
/*****************************************************************************/

import openmetadesign_viz from './openmetadesign.js';

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
});

/*****************************************************************************/
/* ProjectsViz: Helpers */
/*****************************************************************************/
Template.ProjectsViz.helpers({});

/*****************************************************************************/
/* ProjectsViz: Lifecycle Hooks */
/*****************************************************************************/
Template.ProjectsViz.onCreated(function() {
    self.subscription = Meteor.subscribe('projects');
});

Template.ProjectsViz.onRendered(function() {
    Tracker.autorun(function() {
        openmetadesign_viz();
        this.$('svg .button-tooltip').tooltip({
            container: 'body',
            trigger: "hover",
            placement: 'top'
        });
    });
});

Template.ProjectsViz.onDestroyed(function() {});

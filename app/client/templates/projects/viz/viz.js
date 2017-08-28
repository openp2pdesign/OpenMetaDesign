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
    });
});

Template.ProjectsViz.onDestroyed(function() {});

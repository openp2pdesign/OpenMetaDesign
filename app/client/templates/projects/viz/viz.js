/*****************************************************************************/
/* ProjectsViz: Event Handlers */
/*****************************************************************************/

import openmetadesign_viz from './openmetadesign.js';

Template.ProjectsViz.events({
    'click .svg-button': function() {
        Modal.show('GenericModal');
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

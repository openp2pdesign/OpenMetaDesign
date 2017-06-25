/*****************************************************************************/
/* ProjectsViz: Event Handlers */
/*****************************************************************************/

import d3 from 'd3';

Template.ProjectsViz.events({});

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
        d3.select('#d3-container').append('<p>hello</p>');
    });

});

Template.ProjectsViz.onDestroyed(function() {});

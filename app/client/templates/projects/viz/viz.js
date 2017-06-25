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
        d3.select('#d3-container')
            .append("p")
            .attr("id", "myNewParagrap")
            .append("text")
            .text("This is my new text");
    });

});

Template.ProjectsViz.onDestroyed(function() {});

/*****************************************************************************/
/* ProjectsViz: Event Handlers */
/*****************************************************************************/

import d3 from 'd3';

Template.ProjectsViz.events({
    'click .svg-modal-button': function() {
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
        var svg = d3.select('#d3-container').append("svg");
        svg.append("rect")
            .attr("x", 10)
            .attr("y", 10)
            .attr("width", 50)
            .attr("height", 100)
            .attr("class", "svg-modal-button")
            .attr("data-toggle", "modal");

        svg.append("rect")
            .attr("x", 40)
            .attr("y", 50)
            .attr("width", 50)
            .attr("height", 100);

        // Filters
        var defs = svg.append("defs");
        var glow = defs.append("filter")
            .attr("id", "glow");
        glow.append("feGaussianBlur")
            .attr("stdDeviation", "3.5")
            .attr("result", "coloredBlur");
        var feMerge = glow.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "coloredBlur");
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

    });

});

Template.ProjectsViz.onDestroyed(function() {});

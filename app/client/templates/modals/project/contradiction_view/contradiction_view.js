// jquery
import { $ } from 'meteor/jquery';
// Viz
import d3 from 'd3';
// Load Projects and Settings
import { Projects } from '../../../../../lib/collections/projects.js';
import { Settings } from '../../../../../lib/collections/settings.js';
import { Activities } from '../../../../../lib/collections/activities.js';
import { Contradictions } from '../../../../../lib/collections/contradictions.js';

/*****************************************************************************/
/* ContradictionView: Event Handlers */
/*****************************************************************************/
Template.ContradictionView.events({
});

/*****************************************************************************/
/* ContradictionView: Helpers */
/*****************************************************************************/
Template.ContradictionView.helpers({
    data: function() {
        // Get the contradiction data
        var thisData = Contradictions.findOne({
            '_id': this.contradictionId
        });
        // If there is data... then return it
        if (thisData) {
            // Add the data for the nodes
            thisData.firstNodeData = Activities.findOne({
                '_id': thisData.contradictionData.firstNode
            });
            thisData.secondNodeData = Activities.findOne({
                '_id': thisData.contradictionData.secondNode
            });
            // Return the data
            return thisData;
        }
    },
});

/*****************************************************************************/
/* ContradictionView: Lifecycle Hooks */
/*****************************************************************************/
Template.ContradictionView.onCreated(function () {
    Meteor.subscribe('projects');
    Meteor.subscribe('activities');
    Meteor.subscribe('contradictions');
    // Load variables
    thisProjectID = this.data.projectId;
    thisContradictionID = this.data.contradictionId;
});

Template.ContradictionView.onRendered(function () {
    // Visualize the Contradiction with D3

    // Margins
    // https://bl.ocks.org/mbostock/3019563
    var margin = {
        top: 15,
        right: 0,
        bottom: 0,
        left: 0
    };

    // The container for the viz
    var d3Container = document.getElementById("showContradictionDivSVG");

    // Get dimensions of the container on window resize
    window.addEventListener("resize", function(d) {
        width = d3Container.clientWidth;
        height = d3Container.clientHeight;
        console.log(width, height);
    });

    // Remove previous SVG
    d3.select('#showContradictionDivSVG').select('svg').remove();

    // Add the visualization SVG to the container
    var svg = d3.select('#showContradictionDivSVG').append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Visualize the contradiction in the SVG
    svg.append("circle").attr("cx", 30).attr("cy", 30).attr("r", 20);
});

Template.ContradictionView.onDestroyed(function () {
});

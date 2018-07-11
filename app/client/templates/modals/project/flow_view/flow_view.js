// jquery
import { $ } from 'meteor/jquery';
// Viz
import d3 from 'd3';
// Load Projects and Settings
import { Projects } from '../../../../../lib/collections/projects.js';
import { Settings } from '../../../../../lib/collections/settings.js';
import { Activities } from '../../../../../lib/collections/activities.js';
import { Flows } from '../../../../../lib/collections/flows.js';

/*****************************************************************************/
/* FlowView: Event Handlers */
/*****************************************************************************/
Template.FlowView.events({
});

/*****************************************************************************/
/* FlowView: Helpers */
/*****************************************************************************/
Template.FlowView.helpers({
    data: function() {
        // Get the flow data
        var thisData = Flows.findOne({
            '_id': this.flowId
        });
        // If there is data... then return it
        if (thisData) {
            // Add the data for the nodes
            thisData.firstNodeData = Activities.findOne({
                '_id': thisData.flowData.firstNode
            });
            thisData.secondNodeData = Activities.findOne({
                '_id': thisData.flowData.secondNode
            });
            // Return the data
            return thisData;
        }
    }
});

/*****************************************************************************/
/* FlowView: Lifecycle Hooks */
/*****************************************************************************/
Template.FlowView.onCreated(function () {
    Meteor.subscribe('projects');
    Meteor.subscribe('activities');
    Meteor.subscribe('flows');
    // Load variables
    thisProjectID = this.data.projectId;
    thisFlowID = this.data.flowId;
});

Template.FlowView.onRendered(function () {

    // Visualize the Flow with D3

    // Function for loading an SVG
    var loadSVG = function(url, parent) {
        var loadedSVG = parent.append("g");
        d3.xml(Meteor.absoluteUrl(url)).then(function(xml) {
            loadedSVG.node().appendChild(xml.documentElement);
        });
        return loadedSVG;
    }

    // Get the data
    thisFlow = Flows.findOne({
        '_id': thisFlowID
    });
    var activityNode1 = Activities.findOne({
        '_id': thisFlow.flowData.firstNode
    });
    var activityNode2 = Activities.findOne({
        '_id': thisFlow.flowData.secondNode
    });

    // Margins
    // https://bl.ocks.org/mbostock/3019563
    var margin = {
        top: 15,
        right: 0,
        bottom: 0,
        left: 0
    };

    // The container for the viz
    var d3Container = document.getElementById("showFlowDivSVG");

    // Get dimensions of the container on window resize
    window.addEventListener("resize", function(d) {
        width = d3Container.clientWidth;
        height = d3Container.clientHeight;
        //console.log(width, height);
    });

    // Remove previous SVG
    d3.select('#showFlowDivSVG').select('svg').remove();

    // Add the visualization SVG to the container
    var svg = d3.select('#showFlowDivSVG').append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Load SVG activity icons and create two groups
    // Activity 1
    var activityIcon1 = loadSVG("as_full_nolabel_flow.svg", svg).attr("transform", "translate(0,-15)");
    // Activity 2
    var activityIcon2 = loadSVG("as_full_nolabel_flow.svg", svg).attr("transform", "translate(460,-15)");

    // Visualize the flow in the SVG
    // Number and title of activities
    // Activity 1
    svg.append('text')
        .attr("x", "50")
        .attr("y", "100")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .style("font-size", "16px")
        .style("font-weight", "700")
        .text("#" + activityNode1.activityData.number);
    svg.append('text')
        .attr("x", "50")
        .attr("y", "120")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .style("font-size", "16px")
        .style("font-weight", "700")
        .text(activityNode1.activityData.title);
    // Activity 2
    svg.append('text')
        .attr("x", 50+460)
        .attr("y", "100")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .style("font-size", "16px")
        .style("font-weight", "700")
        .text("#" + activityNode2.activityData.number);
    svg.append('text')
        .attr("x", 50+460)
        .attr("y", "120")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .style("font-size", "16px")
        .style("font-weight", "700")
        .text(activityNode2.activityData.title);
    // TODO Arrow (weighted)
    // TODO Type of the flow
    // TODO Resource flowing

});

Template.FlowView.onDestroyed(function () {
});

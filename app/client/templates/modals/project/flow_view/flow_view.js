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
    },
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
    // Load a svg file and append it to a parent element
    var loadSVG = function(url, parent) {

        var loadedSVG = parent.append("g");

        d3.xml(url, function(error, xml) {
            d3.select(loadedSVG).node().appendChild(xml.documentElement);
        });

        return loadedSVG;
    }

    // Visualize the Flow with D3

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
        console.log(width, height);
    });

    // Remove previous SVG
    d3.select('#showFlowDivSVG').select('svg').remove();

    // Add the visualization SVG to the container
    var svg = d3.select('#showFlowDivSVG').append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Visualize the flow in the SVG
    svg.append("circle").attr("cx", 130).attr("cy", 30).attr("r", 20);

    // Load SVG
    //var svgIcon = loadSVG(Meteor.absoluteUrl("font/activity.svg"), svg);
    //svgIcon.attr("transform", "scale(0.035) translate(-20,-320)");
    var url = Meteor.absoluteUrl("as_full_nolabel.svg");
    d3.xml(url)
    .then(function(xml) {
        svg.node().appendChild(xml.documentElement);
    });


});

Template.FlowView.onDestroyed(function () {
});

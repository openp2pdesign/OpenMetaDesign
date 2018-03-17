import { Activities } from '../../../../lib/collections/activities.js';
import { Flows } from '../../../../lib/collections/flows.js';
// Viz
import d3 from 'd3';

/*****************************************************************************/
/* FlowButtons: Event Handlers */
/*****************************************************************************/
Template.FlowButtons.events({
    // Show the div that enable the delete of flows
    'click .delete-flow': function(event, template) {
        event.preventDefault();
        $("#showFlowDiv").hide();
        $("#editFlowDiv").hide();
        $("#deleteFlowDiv").show();
        $("#createFlowDiv").hide();
        $("#discussFlowDiv").hide();
        // Set the discuss to show to the main activity
        Session.set('discussionToShow', Session.get('thisProject') + "-" + Session.get('thisActivity'));
        // Pass the flow id to Sessions
        Session.set('flowToDeleteData', this._id);
    },
    // Show the div that enable the edit of flows
    'click .edit-flow': function(event, template) {
        event.preventDefault();
        $("#showFlowDiv").hide();
        $("#editFlowDiv").show();
        $("#deleteFlowDiv").hide();
        $("#createFlowDiv").hide();
        $("#discussFlowDiv").hide();
        // Set the discuss to show to the main activity
        Session.set('discussionToShow', Session.get('thisProject') + "-" + Session.get('thisActivity'));
        // Pass the flow id to Sessions
        Session.set('flowToShowData', this._id);
    },
    // Show the div that enable the edit of flows
    'click .show-flow': function(event, template) {
        event.preventDefault();
        $("#showFlowDiv").show();
        $("#editFlowDiv").hide();
        $("#deleteFlowDiv").hide();
        $("#createFlowDiv").hide();
        $("#discussFlowDiv").hide();
        // Set the discuss to show to the main activity
        Session.set('discussionToShow', Session.get('thisProject') + "-" + Session.get('thisActivity'));
        // Pass the flow id to Sessions
        Session.set('flowToShowData', this._id);

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
        svg.append("circle").attr("cx", 30).attr("cy", 30).attr("r", 20);

    },
    // Show the div that enable the edit of flows
    'click .create-flow': function(event, template) {
        event.preventDefault();
        $("#showFlowDiv").hide();
        $("#editFlowDiv").hide();
        $("#deleteFlowDiv").hide();
        $("#createFlowDiv").show();
        $("#discussFlowDiv").hide();
        // Set the discuss to show to the main activity
        Session.set('discussionToShow', Session.get('thisProject') + "-" + Session.get('thisActivity'));
    },
    // Show the div that enable the discussions of flows
    'click .discuss-flow': function(event, template) {
        event.preventDefault();
        $("#showFlowDiv").hide();
        $("#editFlowDiv").hide();
        $("#deleteFlowDiv").hide();
        $("#createFlowDiv").hide();
        $("#discussFlowDiv").hide();
        $("#discussFlowDiv").show();
        // Set the discuss to show to the flow
        Session.set('discussionToShow', Session.get('thisProject') + "-" + this._id);
        // Reload the discussion
        // Empty the div
        $("#flowDiscussDiv").empty();
        // Reload template with new data
        Blaze.render(Template.Discuss, document.getElementById('flowDiscussDiv'));
    }
});

/*****************************************************************************/
/* FlowButtons: Helpers */
/*****************************************************************************/
Template.FlowButtons.helpers({});

/*****************************************************************************/
/* FlowButtons: Lifecycle Hooks */
/*****************************************************************************/
Template.FlowButtons.onCreated(function() {});

Template.FlowButtons.onRendered(function() {});

Template.FlowButtons.onDestroyed(function() {});

// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";
// jquery
import { $ } from 'meteor/jquery';
// Random id
import { Random } from 'meteor/random';
// Viz
import d3 from 'd3';
// Load Projects and Settings
import { Projects } from '../../../../../lib/collections/projects.js';
import { Settings } from '../../../../../lib/collections/settings.js';
import { Activities } from '../../../../../lib/collections/activities.js';
import { Flows } from '../../../../../lib/collections/flows.js';

/*****************************************************************************/
/* Flow: Event Handlers */
/*****************************************************************************/
Template.Flow.events({
});
/*****************************************************************************/
/* Flow: Helpers */
/*****************************************************************************/
Template.Flow.helpers({
    activities: function() {
        // Return only the activities in the current project
        return Activities.find({
            'projectId': this._id
        }).fetch();
    },
    activityElements: function() {
        // Return only the activity elements in the current project
        return ActivityElements.find({
            'projectId': this._id
        }).fetch();
    },
    flowData: function() {
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
/* Flow: Lifecycle Hooks */
/*****************************************************************************/
Template.Flow.onCreated(function() {
    Meteor.subscribe('projects');
    Meteor.subscribe('activities');
    Meteor.subscribe('flows');
});

Template.Flow.onRendered(function() {
    // Add tooltip to the tabs
    $('[data-toggle="tab"]').tooltip({
        trigger: 'hover',
        placement: 'top'
    });
    // Enable select2
    $('.select2-dropdown').select2({
        dropdownAutoWidth: true,
        width: '100%'
    });

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
});

Template.Flow.onDestroyed(function() {});

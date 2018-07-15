// jquery
import { $ } from 'meteor/jquery';
// Viz
import d3 from 'd3';
// Load Projects and Settings
import { Projects } from '../../../../../lib/collections/projects.js';
import { Settings } from '../../../../../lib/collections/settings.js';
import { Activities } from '../../../../../lib/collections/activities.js';
import { ActivityElements } from '../../../../../lib/collections/activity_elements.js';
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

    // Function for loading an SVG
    var loadSVG = function(url, parent) {
        var loadedSVG = parent.append("g");
        d3.xml(Meteor.absoluteUrl(url)).then(function(xml) {
            loadedSVG.node().appendChild(xml.documentElement);
        });
        return loadedSVG;
    }

    // Get the data
    thisContradiction = Contradictions.findOne({
        '_id': thisContradictionID
    });
    var activityElementNode1 = ActivityElements.findOne({
        '_id': thisContradiction.contradictionData.firstNode
    });
    var activityElementNode2 = ActivityElements.findOne({
        '_id': thisContradiction.contradictionData.secondNode
    });
    var activityNode1 = Activities.findOne({
        '_id': activityElementNode1.activityId
    });
    var activityNode2 = Activities.findOne({
        '_id': activityElementNode2.activityId
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
    var d3Container = document.getElementById("showContradictionDivSVG");

    // Get dimensions of the container on window resize
    window.addEventListener("resize", function(d) {
        width = d3Container.clientWidth;
        height = d3Container.clientHeight;
        //console.log(width, height);
    });

    // Remove previous SVG
    d3.select('#showContradictionDivSVG').select('svg').remove();

    // Add the visualization SVG to the container
    var svg = d3.select('#showContradictionDivSVG').append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Load SVG activity icons and create two groups
    // Activity 1
    var activityIcon1 = loadSVG("as_full_nolabel_contradiction.svg", svg).attr("transform", "translate(0,-15)");
    // Activity 2
    var activityIcon2 = loadSVG("as_full_nolabel_contradiction.svg", svg).attr("transform", "translate(460,-15)");

    // Visualize the contradiction in the SVG
    // Number and title of activities
    // Activity 1
    svg.append('text')
        .attr("x", 50)
        .attr("y", 100)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .style("font-size", "16px")
        .style("font-weight", "700")
        .text("#" + activityNode1.activityData.number);
    svg.append('text')
        .attr("x", 50)
        .attr("y", 120)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .style("font-size", "16px")
        .style("font-weight", "700")
        .text(activityNode1.activityData.title.slice(0, 7)+"...");
    // Activity 2
    svg.append('text')
        .attr("x", 50+460)
        .attr("y", 100)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .style("font-size", "16px")
        .style("font-weight", "700")
        .text("#" + activityNode2.activityData.number);
    svg.append('text')
        .attr("x", 50+460)
        .attr("y", 120)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .style("font-size", "16px")
        .style("font-weight", "700")
        .text(activityNode2.activityData.title.slice(0, 7)+"...");
    // Arrow
    //Find centers of activity elements
    var activityIconSize = {
        width: 100,
        height: 90
    };
    var getElementCoordinates = function(x,y,title) {
        var activityElementsCenters = {
            subject: {
                x: x + (activityIconSize.width / 2) - 19,
                y: y + (activityIconSize.height / 2) - 34,
                title: "Subject"
            },
            object: {
                x: x + (activityIconSize.width / 2) + 39,
                y: y + (activityIconSize.height / 2),
                title: "Object"
            },
            outcome: {
                x: x + (activityIconSize.width / 2),
                y: y + (activityIconSize.height / 2),
                title: "Outcome"
            },
            tools: {
                x: x + (activityIconSize.width / 2) + 19,
                y: y + (activityIconSize.height / 2) - 34,
                title: "Tools"
            },
            rules: {
                x: x + (activityIconSize.width / 2) - 39,
                y: y + (activityIconSize.height / 2),
                title: "Rules"
            },
            roles: {
                x: x + (activityIconSize.width / 2) + 19,
                y: y + (activityIconSize.height / 2) + 34,
                title: "Roles"
            },
            community: {
                x: x + (activityIconSize.width / 2) - 19,
                y: y + (activityIconSize.height / 2) + 34,
                title: "Community"
            },
        }
        return activityElementsCenters[title];
    }
    var firstNodeCenter = getElementCoordinates(0,-15,activityElementNode1.activityElementData.title);
    var secondNodeCenter = getElementCoordinates(460,-15,activityElementNode2.activityElementData.title);
    // Draw conntradiction start and end
    var contradictionColor = "#63dfff";
    var thisContradictionGroup = svg.append("g").attr("id", thisContradiction._id);
    svg.append("ellipse")
        .attr("cx", firstNodeCenter.x)
        .attr("cy", firstNodeCenter.y)
        .attr("fill", contradictionColor)
        .attr("rx", 5)
        .attr("ry", 5);
    svg.append("ellipse")
        .attr("cx", secondNodeCenter.x)
        .attr("cy", secondNodeCenter.y)
        .attr("fill", contradictionColor)
        .attr("rx", 5)
        .attr("ry", 5);
    // Draw contradiction "arrow"
    // Line
    var line = d3.line()
        .x(function(d) {
            return d.x;
        })
        .y(function(d) {
            return d.y;
        })
        .curve(d3.curveBasis);
    // Calculate the points...
    var points = [];
    // Define curve according to the contradiction levels
    if (thisContradiction.contradictionData.level === "primary") {
        // Primary contradictions as self-loop
        points = [{
                x: firstNodeCenter.x + 4,
                y: firstNodeCenter.y
            },
            {
                x: secondNodeCenter.x,
                y: firstNodeCenter.y - 20
            },
            {
                x: secondNodeCenter.x + 8,
                y: firstNodeCenter.y - 20
            },
            {
                x: secondNodeCenter.x + 4,
                y: secondNodeCenter.y
            },
        ];
    } else if (thisContradiction.contradictionData.level === "secondary") {
        points = [{
                x: firstNodeCenter.x + 4,
                y: firstNodeCenter.y
            },
            {
                x: secondNodeCenter.x + 8,
                y: firstNodeCenter.y
            },
            {
                x: secondNodeCenter.x + 4,
                y: secondNodeCenter.y
            },
        ];
    } else if (thisContradiction.contradictionData.level === "tertiary") {
        points = [{
                x: firstNodeCenter.x + 4,
                y: firstNodeCenter.y
            },
            {
                x: secondNodeCenter.x + 4,
                y: firstNodeCenter.y
            },
            {
                x: secondNodeCenter.x + 4,
                y: secondNodeCenter.y
            },
        ];
    } else if (thisContradiction.contradictionData.level === "quaternary") {
        points = [{
                x: firstNodeCenter.x + 4,
                y: firstNodeCenter.y
            },
            {
                x: secondNodeCenter.x + 4,
                y: firstNodeCenter.y
            },
            {
                x: secondNodeCenter.x + 4,
                y: secondNodeCenter.y
            },
        ];
    }
    // Add the path as the flow viz
    var pathData = line(points);
    var contradictionViz = thisContradictionGroup.selectAll('path')
        .data(points)
        .enter()
        .append('path')
        .attr('d', pathData)
        .attr("stroke", contradictionColor)
        .attr("stroke-width", 4)
        .attr("fill", "none");

});

Template.ContradictionView.onDestroyed(function () {
});

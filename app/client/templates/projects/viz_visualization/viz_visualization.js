// Import Moment
import { moment } from 'meteor/momentjs:moment';
// Import D3
import d3 from 'd3';
import 'd3-fetch';
import timeline from './d3.timeline.js';
// Activity Icon
import activityIconPath from './activityIconPath.js';
activityIconPath = activityIconPath.activityIconPath;
// Diff
let diff = require('deep-diff');
// Import collections
import { Projects } from '../../../../lib/collections/projects.js';
import { Activities } from '../../../../lib/collections/activities.js';
import { ActivityElements } from '../../../../lib/collections/activity_elements.js';
import { Flows } from '../../../../lib/collections/flows.js';
import { Contradictions } from '../../../../lib/collections/contradictions.js';
import { Settings } from '../../../../lib/collections/settings.js';
/*****************************************************************************/
/* VizVisualization: Event Handlers */
/*****************************************************************************/
Template.VizVisualization.events({
    'click .activity-button': function(event) {
        event.preventDefault();
        // Check the data embedded in the button
        item = event.currentTarget.outerHTML;
        dataActivityMode = $(item).attr("data-activity-mode");
        dataProcessId = $(item).attr("data-process-id");
        dataActivityId = $(item).attr("data-activity-id");
        if (dataActivityMode == "edit") {
            // Edit button
            Modal.show('Activity', function() {
                return {
                    "project": thisProject._id,
                    "process": dataProcessId,
                    "activity": dataActivityId,
                    "mode": "edit"
                }
            });
        } else if (dataActivityMode == "add") {
            // Add button
            Modal.show('Activity', function() {
                return {
                    "project": thisProject._id,
                    "process": dataProcessId,
                    "activity": dataActivityId,
                    "mode": "add"
                }
            });
        }
    },
    'click .discuss-button': function(event) {
        event.preventDefault();
        Modal.show('ActivityDiscuss');
    },
    'click .flows-button': function(event) {
        event.preventDefault();
        Modal.show('ActivityFlows');
    },
    'click .issues-button': function(event) {
        event.preventDefault();
        Modal.show('ActivityIssues');
    },
    'click .delete-button': function(event) {
        event.preventDefault();
        // Check the data embedded in the button
        item = event.currentTarget.outerHTML;
        dataActivityId = $(item).attr("data-activity-id");
        // If there's an activity id, delete it
        if (dataActivityId) {
            Modal.show('ActivityDelete', function(event) {
                return {
                    "project": thisProject._id,
                    "activity": dataActivityId
                }
            });
        }
    },
    // Show the div that enable the edit of flows
    'click .edit-flow': function(event, template) {
        event.preventDefault();
        var thisFlow = Flows.findOne({
            '_id': event.currentTarget.id
        });
        // Launch modal
        Modal.show('Flow', function() {
            return {
                "projectId": this.projectId,
                "flowId": event.currentTarget.id,
                "mode": "edit"
            }
        });
    },
    // Show the div that enable the edit of contradictions
    'click .edit-contradiction': function(event, template) {
        event.preventDefault();
        var thisContradiction = Contradictions.findOne({
            '_id': event.currentTarget.id
        });
        // Launch modal
        Modal.show('Contradiction', function() {
            return {
                "projectId": this.projectId,
                "contradictionId": event.currentTarget.id,
                "mode": "edit"
            }
        });
    },
});

/*****************************************************************************/
/* VizVisualization: Helpers */
/*****************************************************************************/
Template.VizVisualization.helpers({
    data: function() {
        return Projects.findOne({
            '_id': thisProject._id
        });
    },
    users: function() {
        return this.users;
    },
});

/*****************************************************************************/
/* VizVisualization: Lifecycle Hooks */
/*****************************************************************************/
Template.VizVisualization.onCreated(function() {
    // Access this specific project
    self.subscription = Meteor.subscribe('projects');
    thisProject = this.data;
    // Access activity elements for contradictions viz
    Meteor.subscribe('activityelements');
});

Template.VizVisualization.onRendered(function() {
    // Set up visualization
    // The container for the viz
    var d3Container = document.getElementById("d3-container");

    // Margins
    // https://bl.ocks.org/mbostock/3019563
    var margin = {
        top: 15,
        right: 0,
        bottom: 15,
        left: 100
    };
    var gutter = 10 + 10 + 10;
    var simpleGutter = 10;
    var labelHeight = 20;

    // Get dimensions of the container on window resize
    window.addEventListener("resize", function(d) {
        width = d3Container.clientWidth;
        height = d3Container.clientHeight;
        console.log(width, height);
    });

    // Add the visualization SVG to the container
    var svg = d3.select('#d3-container').append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    // Setup layout container
    var sectionsSVG = svg
        .append("g")
        .attr("id", "sectionsSVG");

    // Filters
    var defs = svg.append("defs");
    // Glow filter
    var glow = defs.append("filter")
        .attr("id", "glow");
    glow.append("feGaussianBlur")
        .attr("stdDeviation", "1.5")
        .attr("result", "coloredBlur");
    var feMerge = glow.append("feMerge");
    feMerge.append("feMergeNode")
        .attr("in", "coloredBlur");
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    // Functions for reusable elements

    // Load a svg file and append it to a parent element
    var loadSVG = function(url, parent) {
        var loadedSVG = parent.append("g");
        d3.xml(Meteor.absoluteUrl(url)).then(function(xml) {
            loadedSVG.node().appendChild(xml.documentElement);
        });
        return loadedSVG;
    }

    // Create a button with a FontAwesome icon
    var addButton = function(x, y, radius, parent, iconCode) {

        var button = parent.append("g");

        // Add the circle
        button.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", radius);

        // Add the icon
        button.append('text')
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .style("font-family", "FontAwesome")
            .style("font-size", radius.toString() + "px")
            .text(iconCode);

        // Add hover effect and class
        button.attr("class", "svg-button")
            .on("mouseover", function() {
                d3.select(this)
                    .attr("filter", "url(#glow)");
            })
            .on("mouseout", function() {
                d3.select(this)
                    .attr("filter", null);
            });

        return button;
    }

    // Create a section label
    var addSectionLabel = function(text, parent) {

        var sectionLabel = parent.append("g");

        sectionLabel.append("text")
            .text(text)
            .attr("x", 0)
            .attr("y", 0)
            .attr("class", "svg-label")
            .attr("transform", "translate(0,-" + labelHeight + ")");

        return sectionLabel;
    }

    // LAYOUT - HTML

    // Add the buttons svg for html sections

    // Remove previous ones
    d3.selectAll(".html-edit-button").selectAll("*").remove();
    // Add the current ones
    var htmlButtons = d3.selectAll(".html-edit-button").append("svg")
        .attr("width", "45px")
        .attr("height", "20px");

    for (htmlButtonGroup in htmlButtons["_groups"][0]) {
        thisParentID = htmlButtons["_groups"][0][htmlButtonGroup]["parentElement"]["id"];
        thisSvgElement = htmlButtons["_groups"][0][htmlButtonGroup];

        thisGroup = d3.select(thisSvgElement).append("g");
        projectField = thisParentID.replace("html-edit-button-", "");

        // Edit this field button
        var editThisButton = addButton(10, 10, 10, thisGroup, '\uf044');
        editThisButton.attr("data-toggle", "modal")
            .attr("title", "Edit this")
            .attr("data-mode", "edit")
            .attr("data-id", projectField)
            .classed("button-tooltip", true)
            .attr("data-toggle", "tooltip");
    }

    Tracker.autorun(function() {

        // REACTIVE VIZ
        // Reactive var for the autorun
        var thisUpdatedProject = Projects.findOne({
            '_id': thisProject._id
        });
        // Reset Layout
        d3.selectAll("#sectionsSVG").remove();
        var sectionsSVG = svg.append("g").attr("id", "sectionsSVG");
        // Layout: Find the activity with the earlieast start
        activitiesStarts = [];
        // Layout: Find the activity with the latest end
        activitiesEnds = [];
        // Look in each process
        for (process in thisUpdatedProject.processes) {
            // Look in each activity
            for (activity in thisUpdatedProject.processes[process]["activities"]) {
                activityData = thisUpdatedProject.processes[process]["activities"][activity];
                processData = thisUpdatedProject.processes[process];
                activitiesStarts.push(activityData.time.start)
                activitiesEnds.push(activityData.time.end)
            }
        }
        // Layout: Find the first start and last end of activities
        firstStart = _.min(activitiesStarts);
        lastEnd = _.max(activitiesEnds);
        // Draw the Time section
        var timeG = sectionsSVG.append("g").attr("id", "yAxisG");
        // Choose the start and end for the time scale
        if (isFinite(firstStart) && isFinite(lastEnd)) {
            // If there are start and end, then use them for the time scale
            startDate = firstStart;
            endDate = lastEnd;
        } else {
            // If there is no start or end, then use 1 year from now as a time scale
            startDate = new Date();
            endDate = new Date(new Date().setDate(new Date().getDate() + 365))
        }
        // Time scale
        var yScale = d3.scaleTime()
            .domain([startDate, endDate])
            .range([0, d3Container.clientHeight - labelHeight]);
        // Time axis
        let yAxis = d3.axisLeft().scale(yScale)
            .tickFormat(d3.timeFormat("%b %d %Y %I:%M"))
            .ticks(20)
            .tickSize(20, 40);
        timeG.call(yAxis).attr("transform", "translate(0," + labelHeight + ")");
        // Add a d3.layout.timeline
        var bandHeight = 80;
        var timelineLayout = timeline()
            .size([d3Container.clientWidth, d3Container.clientHeight - labelHeight])
            .extent([startDate, endDate])
            .padding(0)
            .maxBandHeight(bandHeight);

        // Time label
        var timeLabel = addSectionLabel("Time", timeG);

        // Draw the activities

        var types = ["Customer processes",
            "Front-Office processes",
            "Back-Office processes",
            "Support processes"
        ];

        // Variables for the visualization
        var xPadding = 25;
        var thisX = 0;
        var activityIconContainerWidth = 60;
        var activityIconContainerHeight = 85;
        var radius = 10;

        var vizActivities = [];
        var processesThisX = [];

        types.forEach(function(type, i) {
            thisX = thisX + xPadding;
            // Get the data of a process and calculate the layout
            var onlyThisType = thisUpdatedProject.processes.filter(function(d) {
                return d.title === type
            });
            var theseBands = timelineLayout(onlyThisType[0].activities);
            vizActivities.push(theseBands);
            // Add main group for this process
            var timelineSVGGroup = sectionsSVG.append("g")
                .attr("id", "timelineSVGGroup")
                .attr("transform", "translate(" + thisX + "," + labelHeight + ")")
                .selectAll("g")
                .data(theseBands)
                .enter()
                .append("g")
                .attr("class", "ProcessVizGroup" + i);
            // Select groups in this group
            var thisProcessGroup = d3.selectAll("g.ProcessVizGroup" + i);
            // Add main activity rect
            thisProcessGroup
                .append("rect")
                .attr("y", function(d) {
                    return d.start;
                })
                .attr("x", function(d) {
                    return d.y;
                })
                .attr("width", function(d) {
                    return 20;
                })
                .attr("height", function(d) {
                    return d.end - d.start;
                })
                .style("fill", function(d) {
                    // Calculate the participationLevelValue
                    switch (d.participation) {
                        case "No participation":
                            participationLevelValue = 0;
                            break;
                        case "Indirect participation":
                            participationLevelValue = 20;
                            break;
                        case "Consultative participation":
                            participationLevelValue = 35;
                            break;
                        case "Shared control":
                            participationLevelValue = 50;
                            break;
                        case "Full control":
                            participationLevelValue = 100;
                            break;
                    }
                    // Set the color of the activity timeline based on the participation level
                    var participationLevelValueColor = participationLevelValue * 255 / 100;
                    participationLevelValueColorString = "rgb(" + participationLevelValueColor + "," + participationLevelValueColor + "," + participationLevelValueColor + ")";
                    return participationLevelValueColorString;
                })
                .style("stroke", "black")
                .style("stroke-width", 1)
                .attr("title", function(d) {
                    // Calculate the participationLevelValue
                    switch (d.participation) {
                        case "No participation":
                            participationLevelValue = 0;
                            break;
                        case "Indirect participation":
                            participationLevelValue = 20;
                            break;
                        case "Consultative participation":
                            participationLevelValue = 35;
                            break;
                        case "Shared control":
                            participationLevelValue = 50;
                            break;
                        case "Full control":
                            participationLevelValue = 100;
                            break;
                    }
                    return "Participation level: " + d.participation + " (" + participationLevelValue + "%)"
                })
                .classed("participation-tooltip", true)
                .attr("data-toggle", "tooltip")
                .classed("activity-hover", true)
                // Add hover effect
                .on("mouseover", function() {
                    d3.select(this)
                        .attr("filter", "url(#glow)");
                })
                .on("mouseout", function() {
                    d3.select(this)
                        .attr("filter", null);
                });

            // Add the participation level percentage text
            thisProcessGroup
                .append("text")
                .text(function(d) {
                    // Calculate the participationLevelValue
                    switch (d.participation) {
                        case "No participation":
                            participationLevelValue = 0;
                            break;
                        case "Indirect participation":
                            participationLevelValue = 20;
                            break;
                        case "Consultative participation":
                            participationLevelValue = 35;
                            break;
                        case "Shared control":
                            participationLevelValue = 50;
                            break;
                        case "Full control":
                            participationLevelValue = 100;
                            break;
                    }

                    return participationLevelValue + "%";
                })
                .attr("x", function(d) {
                    return d.y + 10;
                })
                .attr("y", function(d) {
                    return d.start + 10;
                })
                .attr("class", "participation-level");

            // Add lines to the time axis
            // Line at the start of an activity
            thisProcessGroup
                .append("line")
                .attr("x1", -thisX)
                .attr("y1", function(d) {
                    return d.start;
                })
                .attr("x2", function(d) {
                    return d.y;
                })
                .attr("y2", function(d) {
                    return d.start;
                })
                .attr("stroke", "#a7b5d4")
                .style("stroke-dasharray", ("3,5"))
                .attr("stroke-width", 1)
                .attr("fill", "none");
            // Line at the end of an activity
            thisProcessGroup
                .append("line")
                .attr("x1", -thisX)
                .attr("y1", function(d) {
                    return d.end;
                })
                .attr("x2", function(d) {
                    return d.y;
                })
                .attr("y2", function(d) {
                    return d.end;
                })
                .attr("stroke", "#bb25ba")
                .style("stroke-dasharray", ("3,5"))
                .attr("stroke-width", 1)
                .attr("fill", "none");
            // Activity Icon Box
            var activityIconBoxes = thisProcessGroup.append("g")
                .append("g")
                .attr("class", "activity-icon-boxes" + i);
            // Select groups in this group
            var thisProcessGroupActivityIconBoxes = d3.selectAll("g.activity-icon-boxes" + i);
            // Add main Activiy Icon Rect
            thisProcessGroupActivityIconBoxes
                .append("rect")
                .attr("x", function(d) {
                    return d.y + 20;
                })
                .attr("y", function(d) {
                    return d.start;
                })
                .attr("width", activityIconContainerWidth)
                .attr("height", activityIconContainerHeight)
                .style("stroke-width", "1px")
                .style("fill", "#fff")
                .style("stroke", "#8f8f8f")
                .classed("activity-hover", true)
                // Add hover effect
                .on("mouseover", function() {
                    d3.select(this)
                        .attr("filter", "url(#glow)");
                })
                .on("mouseout", function() {
                    d3.select(this)
                        .attr("filter", null);
                });
            // Activity Icon
            thisProcessGroupActivityIconBoxes
                .append("path")
                .attr("d", activityIconPath)
                .style("fill", "#ba4d4d")
                .attr("transform", function(d) {
                    return "translate(" + (d.y + 20 + 5) + "," + (d.start + 5) + ")";
                });
            // Activity

            // Add the activity button
            var activityEditButtons = thisProcessGroupActivityIconBoxes.append("g")
                .append("g")
                .attr("class", "activityButtons" + i);
            // Select groups in this group
            var thisProcessGroupActivityEditButtons = d3.selectAll("g.activityButtons" + i);
            // Add first circle
            thisProcessGroupActivityEditButtons
                .append("circle")
                .attr("cx", function(d) {
                    return d.y;
                })
                .attr("cy", function(d) {
                    return d.start;
                })
                .attr("r", radius);
            // Add the rect between the circles
            thisProcessGroupActivityEditButtons
                .append("rect")
                .attr("x", function(d) {
                    return d.y;
                })
                .attr("y", function(d) {
                    return d.start - radius;
                })
                .attr("width", function(d) {
                    var buttonWidth = 0;
                    switch (d.number.toString().length) {
                        case 0:
                            buttonWidth = 0;
                            break;
                        case 1:
                            buttonWidth = 20;
                            break;
                        case 2:
                            buttonWidth = 22;
                            break;
                        case 3:
                            buttonWidth = 23;
                            break;
                    }
                    return buttonWidth;
                })
                .attr("height", function(d) {
                    return radius * 2;
                });
            // Add second circle
            thisProcessGroupActivityEditButtons
                .append("circle")
                .attr("cx", function(d) {
                    var buttonWidth = 0;
                    switch (d.number.toString().length) {
                        case 0:
                            buttonWidth = 0;
                            break;
                        case 1:
                            buttonWidth = 20;
                            break;
                        case 2:
                            buttonWidth = 22;
                            break;
                        case 3:
                            buttonWidth = 23;
                            break;
                    }
                    return d.y + buttonWidth;
                })
                .attr("cy", function(d) {
                    return d.start;
                })
                .attr("r", radius);
            // Add the activity number
            thisProcessGroupActivityEditButtons
                .append("text")
                .attr("x", function(d) {
                    return d.y + radius / 2 - (d.number.toString().length * 0.5);
                })
                .attr("y", function(d) {
                    return d.start;
                })
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .style("font-size", radius.toString() + "px")
                .text(function(d) {
                    return "#" + d.number;
                });
            // Add the edit icon
            thisProcessGroupActivityEditButtons
                .append("text")
                .attr("x", function(d) {
                    return d.y + (radius * 1.5) + (d.number.toString().length * 3);
                })
                .attr("y", function(d) {
                    return d.start;
                })
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .style("font-family", "FontAwesome")
                .style("font-size", radius.toString() + "px")
                .text("\uf044");
            // Overall attributes of the buttons
            thisProcessGroupActivityEditButtons
                .attr("transform", function(d) {
                    var buttonWidth = 0;
                    switch (d.number.toString().length) {
                        case 0:
                            buttonWidth = 0;
                            break;
                        case 1:
                            buttonWidth = 20;
                            break;
                        case 2:
                            buttonWidth = 22;
                            break;
                        case 3:
                            buttonWidth = 23;
                            break;
                    }
                    var fullButtonWidth = buttonWidth + radius * 2;
                    return "translate(" + (20 + (activityIconContainerWidth - fullButtonWidth)) + "," + (activityIconContainerHeight - radius * 1.5) + ")";
                })
                .attr("data-toggle", "modal")
                .classed("activity-button", true)
                .attr("title", "Edit this activity")
                .attr("data-activity-mode", "edit")
                .attr("data-activity-id", function(d) {
                    return d.id;
                })
                .attr("data-process-id", function(d) {
                    return d.processId;
                })
                .classed("button-tooltip", true)
                .attr("data-toggle", "tooltip")
                .classed("svg-button", true)
                .on("mouseover", function() {
                    d3.select(this)
                        .attr("filter", "url(#glow)");
                })
                .on("mouseout", function() {
                    d3.select(this)
                        .attr("filter", null);
                });

            // Add section label
            var sectionLabel = thisProcessGroup.append("text")
                .text(type)
                .attr("class", "svg-label")
                .attr("x", 0)
                .attr("y", -labelHeight);

            // Add Add Activity button
            var addActivityButton = addButton(sectionLabel.node().getBBox().width + 15, -labelHeight - 5, 10, thisProcessGroup, '\uf067');
            addActivityButton.attr("data-toggle", "modal")
                .classed("activity-button", true)
                .attr("title", "Add an activity here")
                .attr("data-activity-mode", "add")
                .attr("data-activity-id", "none")
                .attr("data-process-id", function(d) {
                    return d.processId;
                })
                .classed("button-tooltip", true)
                .attr("data-toggle", "tooltip");

            // Add separator lines from the project data
            if (i > 0 && i < thisUpdatedProject.processes.length) {
                var separatorText = thisUpdatedProject.separators[i - 1].text;
                // Add the line
                thisProcessGroup.append("line")
                    .attr("x1", -xPadding)
                    .attr("y1", separatorText.length * 5)
                    .attr("x2", -xPadding)
                    .attr("y2", d3Container.clientHeight)
                    .attr("class", "svg-lines-line");
                // Add the text
                thisProcessGroup.append("text")
                    .text(separatorText)
                    .attr("x", -xPadding)
                    .attr("y", -xPadding)
                    .attr("class", "svg-lines-text");
            }

            // Save the obtained thisX for later use
            processesThisX.push({"process": type, "thisX": thisX});

            // Check size of this section, for the x of the next one
            var lastBandX = [];
            thisProcessGroup
                .append("circle")
                .attr("cx", function(d) {
                    // Get the position of each activity
                    lastBandX.push(d.y + bandHeight);
                    return d.y + bandHeight;
                })
                .attr("cy", 0)
                .attr("r", 0);
            // Get the farthest activity in this process
            var maxX = _.max(lastBandX);
            if (maxX > 240) {
                thisX = _.max(lastBandX);
            } else {
                thisX = thisX + 240;
            }
            // Add some padding before the next process
            thisX = thisX + xPadding * 2;

            // Center of activity elements
            var activityIconSize = {
                width: 55,
                height: 50
            };
            var centerHorizontalPadding = (activityIconContainerWidth - activityIconSize.width) / 2;
            //Find centers of activity elements
            var elements = ["subject", "object", "outcome", "tools", "rules", "roles", "community"];

            elements.forEach(function(element, j) {
                thisProcessGroupActivityIconBoxes
                    .append("circle")
                    .attr("cx", function(d) {
                        var x = d.y;
                        var y = 0;
                        switch (element) {
                            case "subject":
                                x = 16 + (x + activityIconContainerWidth / 2) - 10;
                                break;
                            case "object":
                                x = 15 + (x + activityIconContainerWidth / 2) + 20;
                                break;
                            case "outcome":
                                x = 16 + x + activityIconContainerWidth / 2;
                                break;
                            case "tools":
                                x = 15 + (x + activityIconContainerWidth / 2) + 10;
                                break;
                            case "rules":
                                x = 16 + (x + activityIconContainerWidth / 2) - 19;
                                break;
                            case "roles":
                                x = 16 + (x + activityIconContainerWidth / 2) + 10;
                                break;
                            case "community":
                                x = 16 + (x + activityIconContainerWidth / 2) - 10;
                                break;
                        }
                        d[element]["centerX"] = x + radius / 2;
                        if (element === "outcome") {
                            d["activityCenterX"] = x + radius / 2;
                        }
                        return x + radius / 2;
                    })
                    .attr("cy", function(d) {
                        var x = 0;
                        var y = d.start;
                        switch (element) {
                            case "subject":
                                y = (y + 5 + activityIconSize.height / 2) - 18;
                                break;
                                break;
                            case "object":
                                y = y + 3 + activityIconSize.height / 2;
                                break;
                                break;
                            case "outcome":
                                y = y + 3 + activityIconSize.height / 2;
                                break;
                                break;
                            case "tools":
                                y = (y + 5 + activityIconSize.height / 2) - 18;
                                break;
                            case "rules":
                                y = y + 3 + activityIconSize.height / 2;
                                break;
                            case "roles":
                                y = (y + 5 + activityIconSize.height / 2) + 15;
                                break;
                            case "community":
                                y = (y + 5 + activityIconSize.height / 2) + 15;
                                break;
                        }
                        d[element]["centerY"] = y;
                        if (element === "outcome") {
                            d["activityCenterY"] =y;
                        }
                        return y;
                    })
                    .attr("fill", "rgba(0, 0, 0, 0)")
                    .attr("r", "6.5")
                    .attr("title", function(d) {
                        return d[element].title;
                    })
                    .classed("activity-tooltip", true)
                    .attr("data-toggle", "tooltip");
            });

            // A 'manual' callback for the end of the forEach
            if (i === types.length - 1) {
                console.log(vizActivities);
                // Draw the flows
                var flowsGroup = sectionsSVG.append("g");
                for (flow in thisUpdatedProject.flows) {
                    // Get the ids of the nodes in the flow
                    firstNode = thisUpdatedProject.flows[flow].firstNode;
                    secondNode = thisUpdatedProject.flows[flow].secondNode;
                    // Get the activity center of the node in the flow
                    var firstNodeCenter = {};
                    var secondNodeCenter = {};
                    for (processActivities in vizActivities) {
                        var searchResult = _.findWhere(vizActivities[processActivities], {id: firstNode});
                        if (typeof searchResult !== "undefined") {
                            firstNodeCenter.x = searchResult.outcome.centerX-4+_.findWhere(processesThisX, {process: searchResult.processTitle}).thisX;
                            firstNodeCenter.y = searchResult.outcome.centerY+labelHeight;
                        }
                    }
                    for (processActivities in vizActivities) {
                        var searchResult = _.findWhere(vizActivities[processActivities], {id: secondNode});
                        if (typeof searchResult !== "undefined") {
                            secondNodeCenter.x = searchResult.outcome.centerX-4+_.findWhere(processesThisX, {process: searchResult.processTitle}).thisX;
                            secondNodeCenter.y = searchResult.outcome.centerY+labelHeight;
                        }
                    }
                    //flowsGroup
                    var flowColor = "#73f17b";
                    var thisFlow = flowsGroup.append("g").attr("id", thisUpdatedProject.flows[flow].id);
                    thisFlow.append("circle")
                        .attr("cx", firstNodeCenter.x + 4)
                        .attr("cy", firstNodeCenter.y)
                        .attr("fill", flowColor)
                        .attr("r", 3);
                    thisFlow.append("circle")
                        .attr("cx", secondNodeCenter.x + 4)
                        .attr("cy", secondNodeCenter.y)
                        .attr("fill", flowColor)
                        .attr("r", 3);
                    // Line
                    var line = d3.line()
                        .x(function(d) {
                            return d.x;
                        })
                        .y(function(d) {
                            return d.y;
                        })
                        .curve(d3.curveBasis);
                    // TODO: calculate the points...
                    var points = [{
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
                    // Add the path as the flow viz
                    var pathData = line(points);
                    var flowViz = thisFlow.selectAll('path')
                        .data(points)
                        .enter()
                        .append('path')
                        .attr('d', pathData)
                        .attr("stroke", flowColor)
                        .attr("stroke-width", 2)
                        .attr("fill", "none");
                    // Add an icon in the middle of the path
                    var pathMidPoint = flowViz.node().getPointAtLength(flowViz.node().getTotalLength() * 0.5);
                    var flowVizMidPoint = thisFlow.append("circle")
                        .attr("fill", flowColor)
                        .attr("r", 8)
                        .attr("cx", pathMidPoint.x)
                        .attr("cy", pathMidPoint.y);
                    // Add tooltip
                    flowVizMidPoint.classed("flow-tooltip", true)
                        .attr("title", thisUpdatedProject.flows[flow].title)
                        .attr("data-toggle", "tooltip");
                    // Add the icon
                    thisFlow.append('text')
                        .attr("fill", "#fff")
                        .attr("x", pathMidPoint.x)
                        .attr("y", pathMidPoint.y)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "central")
                        .style("font-family", "FontAwesome")
                        .style("font-size", "8px")
                        .text("\uf074");
                    // Add class for the hover effect and for launching the edit modal
                    thisFlow.attr("class", "activity-hover edit-flow")
                        // Add hover effect
                        .on("mouseover", function() {
                            d3.select(this)
                                .attr("filter", "url(#glow)");
                        })
                        .on("mouseout", function() {
                            d3.select(this)
                                .attr("filter", null);
                        });

                }
            };
        });




        // // Draw the contradictions
        // var contradictionsGroup = sectionsSVG.append("g");
        // for (contradiction in thisUpdatedProject.contradictions) {
        //     // Get the ids of the nodes in the flow
        //     firstNode = thisUpdatedProject.contradictions[contradiction].firstNode;
        //     secondNode = thisUpdatedProject.contradictions[contradiction].secondNode;
        //     // Get the first activity element
        //     var firstActivityElement = ActivityElements.findOne({
        //         '_id': firstNode
        //     });
        //     // Get the second activity element
        //     var secondActivityElement = ActivityElements.findOne({
        //         '_id': secondNode
        //     });
        //     // Get the activity center of the node in the flow
        //     var firstNodeCenter;
        //     var secondNodeCenter;
        //     // Access the data when ready
        //     if ((typeof firstActivityElement != "undefined") && (typeof secondActivityElement != "undefined")) {
        //         for (activity in vizActivities) {
        //             if (vizActivities[activity].id === firstActivityElement.activityId) {
        //                 firstNodeCenter = vizActivities[activity].activityElementsCenters[firstActivityElement.activityElementData.title];
        //             }
        //             if (vizActivities[activity].id === secondActivityElement.activityId) {
        //                 secondNodeCenter = vizActivities[activity].activityElementsCenters[secondActivityElement.activityElementData.title];
        //             }
        //         }
        //     }
        //     //contradictionsGroup
        //     var contradictionColor = "#63dfff";
        //     var thisContradiction = contradictionsGroup.append("g").attr("id", thisUpdatedProject.contradictions[contradiction].id);
        //     thisContradiction.append("circle")
        //         .attr("cx", firstNodeCenter.x + 4)
        //         .attr("cy", firstNodeCenter.y)
        //         .attr("fill", contradictionColor)
        //         .attr("r", 3);
        //     thisContradiction.append("circle")
        //         .attr("cx", secondNodeCenter.x + 4)
        //         .attr("cy", secondNodeCenter.y)
        //         .attr("fill", contradictionColor)
        //         .attr("r", 3);
        //     // Line
        //     var line = d3.line()
        //         .x(function(d) {
        //             return d.x;
        //         })
        //         .y(function(d) {
        //             return d.y;
        //         })
        //         .curve(d3.curveBasis);
        //     // Calculate the points...
        //     var points = [];
        //     // Define curve according to the contradiction levels
        //     if (thisUpdatedProject.contradictions[contradiction].level === "primary") {
        //         // Primary contradictions as self-loop
        //         points = [{
        //                 x: firstNodeCenter.x + 4,
        //                 y: firstNodeCenter.y
        //             },
        //             {
        //                 x: secondNodeCenter.x,
        //                 y: firstNodeCenter.y - 20
        //             },
        //             {
        //                 x: secondNodeCenter.x + 8,
        //                 y: firstNodeCenter.y - 20
        //             },
        //             {
        //                 x: secondNodeCenter.x + 4,
        //                 y: secondNodeCenter.y
        //             },
        //         ];
        //     } else if (thisUpdatedProject.contradictions[contradiction].level === "secondary") {
        //         points = [{
        //                 x: firstNodeCenter.x + 4,
        //                 y: firstNodeCenter.y
        //             },
        //             {
        //                 x: secondNodeCenter.x + 8,
        //                 y: firstNodeCenter.y
        //             },
        //             {
        //                 x: secondNodeCenter.x + 4,
        //                 y: secondNodeCenter.y
        //             },
        //         ];
        //     } else if (thisUpdatedProject.contradictions[contradiction].level === "tertiary") {
        //         points = [{
        //                 x: firstNodeCenter.x + 4,
        //                 y: firstNodeCenter.y
        //             },
        //             {
        //                 x: secondNodeCenter.x + 4,
        //                 y: firstNodeCenter.y
        //             },
        //             {
        //                 x: secondNodeCenter.x + 4,
        //                 y: secondNodeCenter.y
        //             },
        //         ];
        //     } else if (thisUpdatedProject.contradictions[contradiction].level === "quaternary") {
        //         points = [{
        //                 x: firstNodeCenter.x + 4,
        //                 y: firstNodeCenter.y
        //             },
        //             {
        //                 x: secondNodeCenter.x + 4,
        //                 y: firstNodeCenter.y
        //             },
        //             {
        //                 x: secondNodeCenter.x + 4,
        //                 y: secondNodeCenter.y
        //             },
        //         ];
        //     }
        //     // Add the path as the flow viz
        //     var pathData = line(points);
        //     var contradictionViz = thisContradiction.selectAll('path')
        //         .data(points)
        //         .enter()
        //         .append('path')
        //         .attr('d', pathData)
        //         .attr("stroke", contradictionColor)
        //         .attr("stroke-width", 2)
        //         .attr("fill", "none");
        //     // Add an icon in the middle of the path
        //     var pathMidPoint = {};
        //     if (thisUpdatedProject.contradictions[contradiction].level === "primary") {
        //         pathMidPoint = {
        //             x: secondNodeCenter.x + 4,
        //             y: firstNodeCenter.y - 20
        //         };
        //     } else {
        //         pathMidPoint = contradictionViz.node().getPointAtLength(contradictionViz.node().getTotalLength() * 0.5);
        //     }
        //     var contradictionVizMidPoint = thisContradiction.append("circle")
        //         .attr("fill", contradictionColor)
        //         .attr("r", 8)
        //         .attr("cx", pathMidPoint.x)
        //         .attr("cy", pathMidPoint.y);
        //     // Add tooltip
        //     contradictionVizMidPoint.classed("flow-tooltip", true)
        //         .attr("title", thisUpdatedProject.contradictions[contradiction].title)
        //         .attr("data-toggle", "tooltip");
        //     // Add the icon
        //     thisContradiction.append('text')
        //         .attr("fill", "#fff")
        //         .attr("x", pathMidPoint.x)
        //         .attr("y", pathMidPoint.y)
        //         .attr("text-anchor", "middle")
        //         .attr("dominant-baseline", "central")
        //         .style("font-family", "FontAwesome")
        //         .style("font-size", "8px")
        //         .text("\uf071");
        //     // Add class for the hover effect and for launching the edit modal
        //     thisContradiction.attr("class", "activity-hover edit-contradiction")
        //         // Add hover effect
        //         .on("mouseover", function() {
        //             d3.select(this)
        //                 .attr("filter", "url(#glow)");
        //         })
        //         .on("mouseout", function() {
        //             d3.select(this)
        //                 .attr("filter", null);
        //         });
        //
        // }

        // FINAL STEPS
        // Implement zoom and pan
        function zoomed() {
            sectionsSVG.attr("transform", d3.event.transform);
        }
        // If the chart is larger than the initially visualized area, show a notification
        if (sectionsSVG.node().getBBox().width > d3Container.clientWidth) {
            $("#zoom-and-pan").show();
        } else {
            $("#zoom-and-pan").hide();
        }
        var zoom = d3.zoom()
            .scaleExtent([1, 13])
            .translateExtent([
                [-margin.left, -margin.top],
                [sectionsSVG.node().getBBox().width, sectionsSVG.node().getBBox().height]
            ])
            .on("zoom", zoomed);
        // Add initial margin translation
        var transform = d3.zoomIdentity.translate(margin.left, margin.top);
        // Add zoom to svg, disable double click zoom
        svg.call(zoom).on("dblclick.zoom", null);
        // Add zoom to sectionsSVG with initial transformation
        sectionsSVG.call(zoom.transform, transform);
        // Add tooltips to the visualization
        this.$('svg .button-tooltip').tooltip({
            container: 'body',
            trigger: "hover",
            placement: 'top'
        });
        this.$('svg .participation-tooltip').tooltip({
            container: 'body',
            trigger: "hover",
            placement: 'top'
        });
        this.$('svg .activity-tooltip').tooltip({
            container: 'body',
            trigger: "hover",
            placement: 'top'
        });
        this.$('svg .flow-tooltip').tooltip({
            container: 'body',
            trigger: "hover",
            placement: 'top'
        });

    });
});

Template.VizVisualization.onDestroyed(function() {});

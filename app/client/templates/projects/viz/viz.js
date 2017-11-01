/*****************************************************************************/
/* ProjectsViz: Event Handlers */
/*****************************************************************************/

import {
    Session
} from 'meteor/session';
import { 
    Projects
} from '../../../../lib/collections/projects.js';
import { 
    Settings
} from '../../../../lib/collections/settings.js';
// Viz
import d3 from 'd3';
import {
    TextBox
} from 'd3plus-text';
let diff = require('deep-diff');


Template.ProjectsViz.events({
    'click .html-edit-button': function() {
        event.preventDefault();

        event.path.map(function(item) {
            // Check the data embedded in the button
            dataFieldMode = $(item).attr("data-mode");
            dataFieldID = $(item).attr("data-id");

            if (dataFieldMode == "edit") {
                // Edit button
                Modal.show('EditHtml', function() {
                    return {
                        "project": thisProject._id,
                        "field": dataFieldID,
                        "mode": "edit"
                    }
                });
            } else if (dataFieldMode == "discuss") {
                // Discuss button
                Modal.show('DiscussHtml', function() {
                    return {
                        "project": thisProject._id,
                        "field": dataFieldID,
                        "mode": "discuss"
                    }
                });
            }
        });
    },
    'click .activity-button': function() {
        event.preventDefault();

        event.path.map(function(item) {
            // Check the data embedded in the button
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
        });
    },
    'click .discuss-button': function() {
        event.preventDefault();
        Modal.show('ActivityDiscuss');
    },
    'click .flows-button': function() {
        event.preventDefault();
        Modal.show('ActivityFlows');
    },
    'click .issues-button': function() {
        event.preventDefault();
        Modal.show('ActivityIssues');
    },
    'click .delete-button': function() {
        event.preventDefault();

        event.path.map(function(item) {
            // Check the data embedded in the button
            dataActivityId = $(item).attr("data-activity-id");
            // If there's an activity id, delete it
            if (dataActivityId) {
                Modal.show('ActivityDelete', function() {
                    return {
                        "project": thisProject._id,
                        "activity": dataActivityId
                    }
                });
            }
        });
    },
    'click .svg-emoji': function() {
        Modal.show('ActivityAdd');
    },
});

/*****************************************************************************/
/* ProjectsViz: Helpers */
/*****************************************************************************/
Template.ProjectsViz.helpers({
    data: function() {
        return Projects.findOne({
            _id: thisProject._id
        });
    }
});

/*****************************************************************************/
/* ProjectsViz: Lifecycle Hooks */
/*****************************************************************************/
Template.ProjectsViz.onCreated(function() {
    // Access this specific project
    self.subscription = Meteor.subscribe('projects');
    thisProject = this.data;

    // Access settings
    // Subscriptions take time, so check when it's ready
    self.subscription = Meteor.subscribe('settings');
    Tracker.autorun(function() {
        if (self.subscription.ready()) {
            var myset = Settings.findOne();
            GoogleMaps.load({
                key: myset.GoogleMapsAPIkey,
                libraries: 'places'
            });
        }
    });
});

Template.ProjectsViz.onRendered(function() {
    // Set up visualization
    // The container for the viz
    var d3Container = document.getElementById("d3-container");

    // Margins
    // https://bl.ocks.org/mbostock/3019563
    var margin = {
        top: 15,
        right: 0,
        bottom: 0,
        left: 0
    };
    var gutter = 10 + 10 + 10;
    var simpleGutter = 10;
    var labelHeight = 20;

    // Activity
    var participationContainerWidth = 30;
    var mainContainerWidth = 170;
    var containerHeight = 500;

    // Get dimensions of the container on window resize
    window.addEventListener("resize", function(d) {
        width = d3Container.clientWidth;
        height = d3Container.clientHeight;
        console.log(width, height);
    });

    // Add the visualization SVG to the container
    var svg = d3.select('#d3-container').append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Setup layout container
    var sectionsSVG = svg.append("g").attr("id", "sectionsSVG");

    // Debug: see the border of the svg
    // TODO: to be removed
    svg.attr("style", "outline: thin solid black;");

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

    // Emojis for reactions
    // Source: https://github.com/twitter/twemoji
    // License: CC-BY

    var emojis = {
        simple_smile: "",
        heart_eyes: '',
        worried: "",
        angry: "",
        up: "",
        down: ""
    }

    emojis.worried = "";
    emojis.angry = "";
    emojis.up = "";
    emojis.down = "";


    // Functions for reusable elements

    // Load a svg file and append it to a parent element
    var loadSVG = function(url, parent) {

        var loadedSVG = parent.append("g");

        d3.xml(url).mimeType("image/svg+xml").get(function(xml) {
            var svgFile = document.importNode(xml.documentElement, true);
            loadedSVG.node().appendChild(svgFile);
        });

        return loadedSVG;
    }

    // Create an emoji button
    var addEmoji = function(x, y, radius, parent, type) {

        var emoji = parent.append("g");

        // Add the button circle
        var emojiCircle = emoji.append("circle")
            .attr("cx", x + radius)
            .attr("cy", y + radius)
            .attr("r", radius)
            .attr("class", "svg-button");

        // Load SVG
        var svgIcon = loadSVG("/emojis/1f603_2.svg", emoji);
        svgIcon.attr("transform", "scale(0.035) translate(-20,-320)");

        // Add classes
        emoji.attr("class", "svg-emoji")
            .on("mouseover", function() {
                emojiCircle.attr("filter", "url(#glow)");
            })
            .on("mouseout", function() {
                emojiCircle.attr("filter", null);
            });

        return emoji;

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

        // Add classes
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

    // Create a line between sections
    var addSectionLine = function(text, parent) {

        var sectionLine = parent.append("g");

        // Add the line
        sectionLine.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x1", 0)
            .attr("y1", d3Container.clientHeight)
            .attr("class", "svg-lines-line");
        // Add the background behind the text
        sectionLine.append("rect")
            .attr("x", -10)
            .attr("y", 0)
            .attr("width", 20)
            .attr("height", text.length * 5)
            .attr("class", "svg-lines-rect");
        // Add the text
        sectionLine.append("text")
            .text(text)
            .attr("x", 0)
            .attr("y", 0)
            .attr("class", "svg-lines-text");

        return sectionLine;
    }

    // Create an activity
    var addActivity = function(x, y, parent, activityData, processData) {

        var activity = parent.append("g");

        // Add the activity id
        activity.attr("data-activity-id", activityData.id);

        // Add the participation container
        var participationContainer = activity.append("g").attr("class", "svg-activity-participation");

        participationContainer.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", participationContainerWidth)
            .attr("height", containerHeight);

        var participationLevelX = x + participationContainerWidth / 2;
        var participationLevelY = y + 20;

        var participationLevel = participationContainer.append("text")
            .text("Participation Level %")
            .attr("x", 0)
            .attr("y", 0)
            .attr("class", "participation-level")
            .attr("transform", "translate(" + participationLevelX + "," + participationLevelY + ")");

        // Add the main container
        var mainContainer = activity.append("g").attr("class", "svg-activity");

        mainContainer.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", mainContainerWidth)
            .attr("height", containerHeight);

        // Move the main container beside the participation container
        var mainContainerX = participationContainerWidth + 5;
        mainContainer.attr("transform", "translate(" + mainContainerX + ",0)");

        // Add the title with a D3Plus TextBox
        var activityTitle = mainContainer.append('g')
            .attr("id", "textbox-1");

        title = new TextBox()
            .data([{}])
            .select("#textbox-1")
            .text(activityData.title)
            .width(mainContainerWidth - 70)
            .x(x + 10)
            .y(y + 20)
            .fontSize(16)
            .fontWeight(500)
            .render();

        // Add the control buttons
        var activityButtons = mainContainer.append("g");
        // Discuss Button
        var discussButton = addButton(x + 5, y, 10, activityButtons, '\uf086');
        discussButton.attr("data-toggle", "modal")
            .classed("discuss-button", true)
            .attr("title", "Discuss the activity")
            .attr("data-activity-mode", "discuss")
            .attr("data-activity-id", activityData.id)
            .attr("data-process-id", processData.id)
            .classed("button-tooltip", true)
            .attr("data-toggle", "tooltip");
        // Edit Button
        var editButton = addButton(x + 30, y, 10, activityButtons, '\uf044');
        editButton.attr("data-toggle", "modal")
            .classed("activity-button", true)
            .attr("title", "Edit the activity")
            .attr("data-activity-mode", "edit")
            .attr("data-activity-id", activityData.id)
            .attr("data-process-id", processData.id)
            .classed("button-tooltip", true)
            .attr("data-toggle", "tooltip");
        // Flows Button
        var flowsButton = addButton(x + 55, y, 10, activityButtons, '\uf074');
        flowsButton.attr("data-toggle", "modal")
            .classed("flows-button", true)
            .attr("title", "Edit the flows")
            .attr("data-activity-mode", "flows")
            .attr("data-activity-id", activityData.id)
            .attr("data-process-id", processData.id)
            .classed("button-tooltip", true)
            .attr("data-toggle", "tooltip");
        // Issues Button
        var issuesButton = addButton(x + 80, y, 10, activityButtons, '\uf071');
        issuesButton.attr("data-toggle", "modal")
            .classed("issues-button", true)
            .attr("title", "Document contradictions")
            .attr("data-activity-mode", "contradictions")
            .attr("data-activity-id", activityData.id)
            .attr("data-process-id", processData.id)
            .classed("button-tooltip", true)
            .attr("data-toggle", "tooltip");
        // Delete Button
        var deleteButton = addButton(x + 105, y, 10, activityButtons, '\uf068');
        deleteButton.attr("data-toggle", "modal")
            .classed("delete-button", true)
            .attr("title", "Delete the activity")
            .attr("data-activity-mode", "delete")
            .attr("data-activity-id", activityData.id)
            .attr("data-process-id", processData.id)
            .classed("button-tooltip", true)
            .attr("data-toggle", "tooltip");
        // Move the buttons below the title
        activityButtonY = 15 + // padding
            20 + // button size
            parseInt(activityTitle.node().getBBox().height); // title height
        activityButtons.attr("transform", "translate(15," + activityButtonY + ")");

        // Add the description with a D3Plus TextBox
        var activityDescription = mainContainer.append('g')
            .attr("id", "textbox-2");

        description = new TextBox()
            .data([{}])
            .text(activityData.description)
            .width(mainContainerWidth - 30)
            .select("#textbox-2")
            .x(x + 10)
            .y(y + activityButtonY + 20)
            .fontSize(14)
            .fontWeight(400)
            .render();

        // Add emojis
        // var activityEmojis = mainContainer.append("g");
        // var emoji01 = addEmoji(x, y, 10, activityEmojis, "smile");
        // emoji01.attr("title", "I like it!")
        //     .classed("button-tooltip", true)
        //     .attr("data-toggle", "tooltip");
        // var emoji02 = addEmoji(x + 25, y, 10, activityEmojis, "smile");
        // emoji02.attr("title", "I like it!")
        //     .classed("button-tooltip", "true")
        //     .attr("data-toggle", "tooltip");
        // var emoji03 = addEmoji(x + 50, y, 10, activityEmojis, "smile");
        // emoji03.attr("title", "I like it!")
        //     .classed("button-tooltip", true)
        //     .attr("data-toggle", "tooltip");

        // Return the whole activity
        return activity;

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
        // Discuss this field button
        var discussThisButton = addButton(32, 10, 10, thisGroup, '\uf074');
        discussThisButton.attr("data-toggle", "modal")
            .attr("title", "Discuss this")
            .attr("data-mode", "discuss")
            .attr("data-id", projectField)
            .classed("button-tooltip", true)
            .attr("data-toggle", "tooltip");
    }

    Tracker.autorun(function() {

        // REACTIVE EDITING
        // Reactive var for the autorun
        var thisUpdatedProject = Projects.findOne({
            _id: thisProject._id
        });

        // LAYOUT - SVG
        // Both general layout and all activities are rendered programmatically here
        // Layout: Find the activity with the earlieast start
        activitiesStarts = []
        // Layout: Find the activity with the latest end
        activitiesEnds = []
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

        // Reset Layout
        d3.selectAll("#sectionsSVG").remove();
        var sectionsSVG = svg.append("g").attr("id", "sectionsSVG");
        // Draw the Time section
        var timeG = sectionsSVG.append("g").attr("id", "yAxisG");
        // Choose the start and end for the time scale
        if (isFinite(firstStart) || isFinite(lastEnd)) {
            // If there are start and end, then use them for the time scale
            startDate = firstStart;
            endDate = lastEnd;
        } else {
            // If there is no start or end, then use 1 year from now as a time scale
            startDate = new Date();
            endDate = new Date().setFullYear(new Date().getFullYear() + 1);
        }
        // Time scale
        var yScale = d3.scaleTime()
            .domain([startDate, endDate])
            .range([0, d3Container.clientHeight - labelHeight]);
        // Time axis
        let yAxis = d3.axisLeft().scale(yScale)
            .ticks(16)
            .tickSize(10);
        timeG.transition().duration(1000).call(yAxis);

        // Time label
        var timeLabel = addSectionLabel("Time", timeG);

        // Draw the Processes sections
        var sections = []
        var sectionGroups = [];
        var sectionLabels = [];
        var lineGroups = [];

        for (var j in thisUpdatedProject.processes) {
            sectionGroups.push(sectionsSVG.append("g"));
            lineGroups.push(sectionsSVG.append("g"));
        }

        for (var j in thisUpdatedProject.processes) {
            // Add section label
            sectionLabels.push(addSectionLabel(thisUpdatedProject.processes[j].title, sectionGroups[j]));

            // Add Add Activity button
            var addActivityButton = addButton(sectionLabels[j].node().getBBox().width + 15, -labelHeight - 5, 10, sectionLabels[j], '\uf067');
            addActivityButton.attr("data-toggle", "modal")
                .classed("activity-button", true)
                .attr("title", "Add an activity here")
                .attr("data-activity-mode", "add")
                .attr("data-activity-id", "none")
                .attr("data-process-id", thisUpdatedProject.processes[j].id)
                .classed("button-tooltip", true)
                .attr("data-toggle", "tooltip");

                // Add separator line
                // TODO: get text from the data, add a new Schema
                console.log(thisUpdatedProject.processes[j].title);
                for (separator in thisUpdatedProject.separators) {
                    thisSeparator = thisUpdatedProject.separators[separator]
                    if (thisSeparator.second === thisUpdatedProject.processes[j].title) {
                        console.log(thisSeparator.text);
                        addSectionLine(thisSeparator.text, sectionGroups[j]);
                    }
                }

        }

        // Draw the Journey section
        // Journey label
        // var journeyLabel = addSectionLabel("Journey", journeyG);
        //
        // journeyG.append("rect")
        //     .attr("x", 0)
        //     .attr("y", 0)
        //     .attr("width", 50)
        //     .attr("height", 20)
        //     .attr("fill", "orange");


        // Organize sections
        // In case we need to get the transform of an element: https://stackoverflow.com/a/38753017/2237113

        // TODO Each section should be wide enough to avoid have overlapping activities

        // Translate timeG according to the label width
        var GX = d3.select("#yAxisG").node().getBBox().width + 20;
        timeG.attr("transform", "translate(" + GX + "," + labelHeight + ")");

        for (var j in thisProject.processes) {
            if (j == 0) {
                GX = GX + simpleGutter;
            } else {
                GX = GX + sectionGroups[j - 1].node().getBBox().width + gutter;
            }

            sectionGroups[j].attr("transform", "translate(" + GX + "," + labelHeight + ")");

        }

        // Translate journeyG it after the timeG section
        // var journeyGX = blueprintGX + blueprintSupportG.node().getBBox().width + simpleGutter;
        // journeyG.attr("transform", "translate(" + journeyGX + "," + labelHeight + ")");

        // Draw the activities
        // Look in each process
        for (process in thisUpdatedProject.processes) {
            // Look in each activity
            for (activity in thisUpdatedProject.processes[process]["activities"]) {
                activityData = thisUpdatedProject.processes[process]["activities"][activity];
                processData = thisUpdatedProject.processes[process];
                // Draw the activity
                // ...
                console.log("Drawing activity with id",activityData.id);
            }
        }

        // FINAL STEPS
        // Add tooltips to the visualization
        this.$('svg .button-tooltip').tooltip({
            container: 'body',
            trigger: "hover",
            placement: 'top'
        });

    });
});

Template.ProjectsViz.onDestroyed(function() {});

/*****************************************************************************/
/* ProjectsViz: Event Handlers */
/*****************************************************************************/

import { Session } from 'meteor/session';
import { Projects } from '../../../../lib/collections/projects.js';
import { Settings } from '../../../../lib/collections/settings.js';
// Viz
import d3 from 'd3';
import { TextBox } from 'd3plus-text';
let diff = require('deep-diff');


Template.ProjectsViz.events({
    'click .activity-button': function() {
        event.preventDefault();

        event.path.map( function(item) {
            // Check the data embedded in the button
            dataActivityMode = $(item).attr("data-activity-mode");
            dataProcessId = $(item).attr("data-process-id");
            dataActivityId = $(item).attr("data-activity-id");

            if (dataActivityMode == "edit") {
                // Edit button
                Modal.show('Activity', function () {
                    return { "project": thisProject._id,
                    "process": dataProcessId,
                    "activity": dataActivityId,
                    "mode": "edit" }
                });
            } else if (dataActivityMode == "add") {
                // Add button
                Modal.show('Activity', function () {
                    return { "project": thisProject._id,
                    "process": dataProcessId,
                    "activity": dataActivityId,
                    "mode": "add" }
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

        event.path.map( function(item) {
            // Check the data embedded in the button
            dataActivityId = $(item).attr("data-activity-id");
            // If there's an activity id, delete it
            if (dataActivityId) {
                Modal.show('ActivityDelete', function () {
                    return { "project": thisProject._id,
                    "activity": dataActivityId }
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
        return thisProject;
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
    Tracker.autorun(function() {

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

        // Get dimensions of the container on window resize
        window.addEventListener("resize", function(d) {
            width = d3Container.clientWidth;
            height = d3Container.clientHeight;
            console.log(width, height);
        });

        // Add the SVG to the container
        var svg = d3.select('#d3-container').append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
                .attr("y1", 300)
                .attr("class", "svg-lines-line");
            // Add the background behind the text
            sectionLine.append("rect")
                .attr("x", -10)
                .attr("y", 0)
                .attr("width", 20)
                .attr("height", 100)
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

            // Dimensions
            var participationContainerWidth = 30;
            var mainContainerWidth = 170;
            var containerHeight = 500;

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
            var activityEmojis = mainContainer.append("g");
            var emoji01 = addEmoji(x, y, 10, activityEmojis, "smile");
            emoji01.attr("title", "I like it!")
                .classed("button-tooltip", true)
                .attr("data-toggle", "tooltip");
            var emoji02 = addEmoji(x + 25, y, 10, activityEmojis, "smile");
            emoji02.attr("title", "I like it!")
                .classed("button-tooltip", "true")
                .attr("data-toggle", "tooltip");
            var emoji03 = addEmoji(x + 50, y, 10, activityEmojis, "smile");
            emoji03.attr("title", "I like it!")
                .classed("button-tooltip", true)
                .attr("data-toggle", "tooltip");

            // Return the whole activity
            return activity;

        }

        // Debug: see the border of the svg
        svg.attr("style", "outline: thin solid black;");

        // LAYOUT

        // Draw the Time section
        // Time scale and axis
        var timeG = svg.append("g");

        // TODO: get time domain from earliest start and latest end activities
        var yScale = d3.scaleTime()
            .domain([new Date(2000, 0, 1), new Date(2001, 0, 11)])
            .range([0, 800]);
        yAxis = d3.axisLeft().scale(yScale)
            .ticks(16)
            .tickSize(10);
        timeG.attr("id", "yAxisG")
            .call(yAxis);

        // Time label
        var timeLabel = addSectionLabel("Time", timeG);

        // Draw the Processes sections
        var sections = []
        var sectionGroups = [];
        var sectionLabels = [];
        var lineGroups = [];

        for (var j in thisProject.processes) {
            sectionGroups.push(svg.append("g"));
            lineGroups.push(svg.append("g"));
        }

        for (var j in thisProject.processes) {
            // Add section label
            sectionLabels.push(addSectionLabel(thisProject.processes[j].title, sectionGroups[j]));

            // Add Activity button
            var addActivityButton = addButton(sectionLabels[j].node().getBBox().width+15, -labelHeight-5, 10, sectionLabels[j], '\uf067');
            addActivityButton.attr("data-toggle", "modal")
                .classed("activity-button", true)
                .attr("title", "Add an activity here")
                .attr("data-activity-mode", "add")
                .attr("data-activity-id", "none")
                .attr("data-process-id", thisProject.processes[j].id)
                .classed("button-tooltip", true)
                .attr("data-toggle","tooltip");

            if (j > 0) {
                // Add separator line
                addSectionLine("Line 01...", sectionGroups[j]);
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

        // Add tooltips to the visualization
        this.$('svg .button-tooltip').tooltip({
            container: 'body',
            trigger: "hover",
            placement: 'top'
        });


        // Organize sections
        // In case we need to get the transform of an element: https://stackoverflow.com/a/38753017/2237113

        // TODO Each section should be wide enough to have overlapping activities

        // Translate timeG according to the label width
        var GX = timeG.node().getBBox().width;
        timeG.attr("transform", "translate(" + GX + "," + labelHeight + ")");

        for (var j in thisProject.processes) {
            if (j == 0) {
                GX = GX + timeG.node().getBBox().x + timeG.node().getBBox().width + simpleGutter;
            } else {
                GX = GX + sectionGroups[j].node().getBBox().width + gutter / 2;
            }

            console.log("TR",j, GX);

            sectionGroups[j].attr("transform", "translate(" + GX + "," + labelHeight + ")");

        }

        // Translate journeyG it after the timeG section
        // var journeyGX = blueprintGX + blueprintSupportG.node().getBBox().width + simpleGutter;
        // journeyG.attr("transform", "translate(" + journeyGX + "," + labelHeight + ")");

        // ACTIVITIES

        // Reactive var for the autorun
        var thisUpdatedProject = Projects.findOne({_id: thisProject._id });
        console.log("thisProject:",thisProject);
        console.log("thisUpdatedProject:",thisUpdatedProject);

        // Check differences with the previous version of the document
        // In order not to redraw all the project
        var differences = diff(thisUpdatedProject, thisProject);
        for (diff in differences) {
            if (differences[diff].path != "updatedAt") {
                console.log(differences[diff]);
                elementsChanged = differences[diff].path;
                if (differences[diff].kind === "A") {
                    console.log("ADDED");
                    console.log(elementsChanged);
                } else if (differences[diff].kind === "E") {
                    console.log("EDIT");
                    for (element in elementsChanged) {
                        if (element != "updatedAt") {
                            console.log("EDIT is not timestamp");
                            console.log(elementsChanged);
                        }
                    }
                } else if (differences[diff].kind === "D") {
                    console.log("DELETE");
                    console.log(elementsChanged);
                }
                // An activity was added
                // ...
                // An activity was edited
                // ...
                // An activity was deleted
                // ...
                // An issue was added
                // ...
                // An issue was edited
                // ...
                // An issue was deleted
                // ...
                // A flow was added
                // ...
                // A flow was edited
                // ...
                // A flow was deleted
                // ...
            }

        }

        for (process in thisUpdatedProject.processes) {
            console.log("PROCESS:", thisUpdatedProject.processes[process]);
            for (activity in thisUpdatedProject.processes[process]["activities"]) {
                activityData = thisUpdatedProject.processes[process]["activities"][activity];
                processData = thisUpdatedProject.processes[process];
                console.log("ACTIVITIES:", );
                x = 10;
                y = 10;
                parent = sectionGroups[0];
                addActivity(x, y, parent, activityData, processData);
            }
        }


    });
});

Template.ProjectsViz.onDestroyed(function() {});

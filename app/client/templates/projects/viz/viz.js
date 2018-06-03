// Import Leaflet
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Import Highlight.js
import 'highlight.js/styles/github.css';
import hljs from 'highlight.js';
// Import Moment
import { moment } from 'meteor/momentjs:moment';
// Import D3
import d3 from 'd3';
import { TextBox } from 'd3plus-text';
let diff = require('deep-diff');
// Import collections
import { Projects } from '../../../../lib/collections/projects.js';
import { Activities } from '../../../../lib/collections/activities.js';
import { Settings } from '../../../../lib/collections/settings.js';

/*****************************************************************************/
/* ProjectsViz: Event Handlers */
/*****************************************************************************/
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
                // Set the session variable for the discussion
                Session.set('discussionToShow', thisProject._id + "-" + dataFieldID);
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
    'click .activities-without-location': function() {
        var thisActivityId= event.target.getAttribute('data-id');
        var thisActivityData = Activities.findOne({ '_id': thisActivityId });
        Modal.show('Activity', function() {
            return {
                "project": thisProject._id,
                "process": thisActivityData.processId,
                "activity": thisActivityData.activityData.id,
                "mode": "edit"
            }
        });
    }
});

/*****************************************************************************/
/* ProjectsViz: Helpers */
/*****************************************************************************/
Template.ProjectsViz.helpers({
    data: function() {
        return Projects.findOne({
            '_id': thisProject._id
        });
    },
    activitiesWithoutLocation: function() {
        var activitiesWithoutLocation = [];
        var activitiesToMap = Activities.find({ 'projectId': thisProject._id }).fetch();
        for (activity in activitiesToMap) {
            // If the activity hasn't a location
            if (typeof activitiesToMap[activity].activityData.location == "undefined") {
                activitiesWithoutLocation.push(activitiesToMap[activity].activityData);
            }
        }
        return activitiesWithoutLocation;
    },
    jsoncode: function() {
        var data = Projects.findOne({
            '_id': thisProject._id
        });
        return JSON.stringify(data,null,'\t');
    },
    versions: function() {
        var prettifiedData = [];
        for (version in thisProject.versions) {
            var thisData = {
                "id": thisProject.versions[version].id,
                "number": thisProject.versions[version].number,
                "updatedAtBy": thisProject.versions[version].updatedAtBy,
                "updatedAt": thisProject.versions[version].updatedAt,
                "updatedAtRelative": moment(thisProject.versions[version].updatedAt).calendar(),
                "diff": JSON.stringify(JSON.parse(thisProject.versions[version].diff),null,'\t'),
            };
            prettifiedData.push(thisData);
        }

        return prettifiedData;
    },
});
/*****************************************************************************/
/* ProjectsViz: Lifecycle Hooks */
/*****************************************************************************/
Template.ProjectsViz.onCreated(function() {
    // Access this specific project
    self.subscription = Meteor.subscribe('projects');
    thisProject = this.data;
});

Template.ProjectsViz.onRendered(function() {
    // Add tooltip to the tabs
    $('[data-toggle="tab"]').tooltip({
        trigger: 'hover',
        placement: 'top'
    });
    // Highlight.js
    $("code").each(function(i, block) {
        hljs.highlightBlock(block);
    });

    // Add the Locations map
    var locationsMap = L.map('locationsMap').setView([39.223841, 9.121661], 3);
    // Tiles: http://leaflet-extras.github.io/leaflet-providers/preview/#filter=Esri.WorldGrayCanvas
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    }).addTo(locationsMap);
    // Add markers: setup
    var markersData = [];
    var activitiesWithoutLocation = [];
    var activityIcon = L.icon({
        iconUrl: '/map/activityIconShadow.svg',
        iconSize: [38, 95],
        popupAnchor: [0, -7]
    });
    // Fix the Locations map size when the tab is shown
    // Add the markers
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(event) {
        var target = $(event.target).attr("href") // activated tab
        if (target === '#view-locations') {
            locationsMap.invalidateSize();
            // Cycle through the activities to get the location data
            var activitiesToMap = Activities.find({
                'projectId': thisProject._id
            }).fetch();
            if (activitiesToMap.length > 0) {
                for (activity in activitiesToMap) {
                    // If the activity has a location
                    if (typeof activitiesToMap[activity].activityData.location !== "undefined") {
                        var marker = [activitiesToMap[activity].activityData.location.latitude, activitiesToMap[activity].activityData.location.longitude, "<strong>#" + activitiesToMap[activity].activityData.number + "</strong> " + activitiesToMap[activity].activityData.title,
                            activitiesToMap[activity]
                        ];
                        markersData.push(marker);
                    } else {
                        activitiesWithoutLocation.push(activitiesToMap[activity].activityData);
                    }
                }
                // Create the markers from the data
                var markersArray = [];
                for (var i = 0; i < markersData.length; i++) {
                    var lon = markersData[i][0];
                    var lat = markersData[i][1];
                    var tooltipText = markersData[i][2];
                    var activityProcessId = markersData[i][3].processId;
                    var activityData = markersData[i][3].activityData;
                    // Leaflet has flipped coordinates...
                    var markerLocation = new L.LatLng(lon, lat);
                    var marker = new L.Marker(markerLocation, {
                        icon: activityIcon
                    });
                    marker.activityData = activityData;
                    marker.processId = activityProcessId;
                    // Add a permanent tooltup
                    var tooltip = new L.Tooltip({
                        direction: 'bottom',
                        permanent: true,
                        noWrap: true,
                        opacity: 0.9
                    });
                    tooltip.setContent(tooltipText);
                    //marker.bindTooltip(tooltip, {className: 'leaflet-activity-tooltip'}).openTooltip();
                    markersArray.push(marker);
                }
                // Add the markers to a group and set the view to contain all markers
                var markersGroup = L.featureGroup(markersArray).addTo(locationsMap);
                setTimeout(function() {
                    locationsMap.fitBounds(markersGroup.getBounds());
                }, 1000);

                // Add the modal
                for (var i = 0; i < markersArray.length; i++) {
                    markersArray[i].on('click', function() {
                        var thisActivityId = this.activityData.id;
                        var thisProcessId = this.processId;
                        Modal.show('Activity', function() {
                            return {
                                "project": thisProject._id,
                                "process": thisProcessId,
                                "activity": thisActivityId,
                                "mode": "edit"
                            }
                        });
                    });
                }
            }
        }
    });

    // Set up visualization
    // The container for the viz
    var d3Container = document.getElementById("d3-container");

    // Margins
    // https://bl.ocks.org/mbostock/3019563
    var margin = {
        top: 15,
        right: 0,
        bottom: 0,
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
        .attr("height", "100%")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Setup layout container
    var sectionsSVG = svg.append("g").attr("id", "sectionsSVG");

    // Debug: see the border of the svg
    // TODO:70 to be removed
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
    var addActivity = function(x, y, height, parent, activityData, processData) {

        // Variables for customizing the viz
        var activityTimelineMargin = 4;
        var activityTimelineWidth = 15;
        var activityIconTimelineWidth = 50;
        var activityIconTimelineHeight = 50;

        // Add the main group
        var activity = parent.append("g");

        // Add the activity id
        activity.attr("data-activity-id", activityData.id);

        // Add the activity timeline
        var activityTimeline = activity.append("g").attr("class", "svg-activity-participation");
        var activityTimelineContainer = activityTimeline.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", activityTimelineWidth)
            .attr("height", height);

        // Add participation level information to the activity timeline
        var participationLevelX = x + activityTimelineWidth / 2;
        var participationLevelY = y + 5;
        var participationLevelValue = 0;
        // Calculate the participationLevelValue
        switch(activityData.participation) {
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
        var participationLevelValueColor = participationLevelValue*255/100;
        participationLevelValueColorString = "rgb("+participationLevelValueColor+","+participationLevelValueColor+","+participationLevelValueColor+")";
        activityTimelineContainer
            .attr("fill", participationLevelValueColorString);
        // Add the participation level percentage text
        var participationLevel = activityTimeline.append("text")
            .text(participationLevelValue + "%")
            .attr("x", 0)
            .attr("y", 0)
            .attr("class", "participation-level")
            .attr("transform", "translate(" + participationLevelX + "," + participationLevelY + ")");

        // Add the activity icon container
        var activityIconTimeline = activity.append("g").attr("class", "svg-activity");

        activityIconTimeline.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", activityIconTimelineWidth)
            .attr("height", activityIconTimelineHeight);

        // Move the activity icon container beside the participation container
        var activityIconTimelineX = activityTimelineWidth;
        activityIconTimeline.attr("transform", "translate(" + activityIconTimelineX + ",0)");

        // Add the title
        var activityTitle = activityIconTimeline.append('g')
            .append("text")
            .text("#...")
            .attr("x", 0)
            .attr("y", 0)
            .attr("transform", "translate(" + participationLevelX + "," + participationLevelY + ")");

        // Add the edit button
        var activityButtons = activityIconTimeline.append("g");
        var editButton = addButton(x + 30, y, 10, activityButtons, '\uf044');
        editButton.attr("data-toggle", "modal")
            .classed("activity-button", true)
            .attr("title", "Edit the activity")
            .attr("data-activity-mode", "edit")
            .attr("data-activity-id", activityData.id)
            .attr("data-process-id", processData.id)
            .classed("button-tooltip", true)
            .attr("data-toggle", "tooltip");
        // Move the buttons below the title
        activityButtonY = 15 + // padding
            15 + // button size
            parseInt(activityTitle.node().getBBox().height); // title height
        activityButtons.attr("transform", "translate(15," + activityButtonY + ")");

        // Add a margin for the whole activity from the separator lines
        activity.attr("transform", "translate("+activityTimelineMargin+",0)");

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
    }

    Tracker.autorun(function() {

        // REACTIVE VIZ
        // Reactive var for the autorun
        var thisUpdatedProject = Projects.findOne({
            '_id': thisProject._id
        });

        // LAYOUT - SVG
        // Both general layout and all activities are rendered programmatically here
        // Layout: Find the activity with the earlieast start
        activitiesStarts = [];
        // Layout: Find the activity with the latest end
        activitiesEnds = [];
        activitiesRanges = [];
        overlaps = [];
        // Look in each process
        for (process in thisUpdatedProject.processes) {
            // Look in each activity
            for (activity in thisUpdatedProject.processes[process]["activities"]) {
                activityData = thisUpdatedProject.processes[process]["activities"][activity];
                processData = thisUpdatedProject.processes[process];
                activitiesStarts.push(activityData.time.start)
                activitiesEnds.push(activityData.time.end)
                activitiesRanges.push(moment().range(moment(activityData.time.start), moment(activityData.time.end)));
            }
            // Check overlaps between activities in each process for the layout
            overlapsCount = 0;
            overlapRanges = []
            for (range in activitiesRanges) {
                firstRange = activitiesRanges[range];
                for (anotherRange in activitiesRanges) {
                    secondRange = activitiesRanges[anotherRange];
                    // Avoid to check the same dates
                    if (!firstRange.isSame(secondRange)) {
                        // If they overlaps...
                        if (firstRange.overlaps(secondRange)) {
                            overlapsCount += 1;
                            overlapRanges.push({
                                "first": firstRange,
                                "second": secondRange
                            });
                        }
                    }
                }
            }
            // Get the final number of meaningful overlaps per process
            if (overlapsCount > 0) {
                console.log(overlapRanges);
            }
            overlaps.push({
                process: thisUpdatedProject.processes[process]["title"],
                overlaps: overlapsCount
            });
            activitiesRanges = [];
            overlapsCount = 0;
            overlapRanges = []
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
            .ticks(10)
            .tickSize(20, 40);
        timeG.transition().duration(1000).call(yAxis).attr("transform", "translate(0," + labelHeight + ")");

        // Time label
        var timeLabel = addSectionLabel("Time", timeG);

        // Draw the Processes sections
        var sections = []
        var sectionsGroups = [];
        var sectionLabels = [];
        var lineGroups = [];

        for (var j in thisUpdatedProject.processes) {
            sectionsGroups.push(sectionsSVG.append("g").attr("id", thisUpdatedProject.processes[j].title));
            lineGroups.push(sectionsSVG.append("g"));
            // Add section label
            sectionLabels.push(addSectionLabel(thisUpdatedProject.processes[j].title, sectionsGroups[j]));

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

            // Add separator lines from the project data
            for (separator in thisUpdatedProject.separators) {
                thisSeparator = thisUpdatedProject.separators[separator]
                if (thisSeparator.second === thisUpdatedProject.processes[j].title) {
                    addSectionLine(thisSeparator.text, sectionsGroups[j]);
                }
            }

            // TODO Add a separator at the end, so that the svg is wide as the available space

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

        // TODO:30 Each section should be wide enough to avoid have overlapping activities

        // TODO Implement this as a function that will be called when the browser resizes, above

        sectionsWidth = []

        // Translate timeG according to the label width
        var GX = 0;
        sectionsWidth.push({
            "section": "Time",
            "x": GX
        });

        // Calculate the width of the section based on the available size
        sectionCalculatedWidth = (d3Container.clientWidth-margin.left-simpleGutter)/(thisProject.processes.length);

        for (var j in thisProject.processes) {
            if (j == 0) {
                GX = GX + simpleGutter;
            } else {
                GX = GX + sectionCalculatedWidth;
            }
            sectionsWidth.push({
                "section": thisProject.processes[j].title,
                "x": GX
            });
            sectionsGroups[j].attr("transform", "translate(" + GX + "," + labelHeight + ")");

        }

        // Draw the activities
        // Look in each process
        for (process in thisUpdatedProject.processes) {
            // Look in each activity
            for (activity in thisUpdatedProject.processes[process]["activities"]) {
                activityData = thisUpdatedProject.processes[process]["activities"][activity];
                processData = thisUpdatedProject.processes[process];
                // Draw the activity
                console.log("Drawing activity with id", activityData.id, "in process", processData.title);
                // Find the process group in the svg
                for (group in sectionsGroups) {
                    sectionSelection = sectionsGroups[group]._groups[0][0];
                    sectionSelectionID = $(sectionSelection).attr("id");
                    if (sectionSelectionID == processData.title) {
                        parentGroup = sectionsGroups[group];
                    }
                }
                // Find the width
                for (width in sectionsWidth) {
                    if (sectionsWidth[width].section == processData.title) {
                        sectionX = sectionsWidth[width].x;
                    }
                }
                addActivity(sectionX, labelHeight + yScale(activityData.time.start), yScale(activityData.time.end), svg, activityData, thisUpdatedProject.processes[process]);
            }
        }

        // Translate journeyG it after the timeG section
        // var journeyGX = blueprintGX + blueprintSupportG.node().getBBox().width + simpleGutter;
        // journeyG.attr("transform", "translate(" + journeyGX + "," + labelHeight + ")");

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

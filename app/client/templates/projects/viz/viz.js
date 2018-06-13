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
import 'd3-fetch';
// Diff
let diff = require('deep-diff');
// Import collections
import { Projects } from '../../../../lib/collections/projects.js';
import { Activities } from '../../../../lib/collections/activities.js';
import { Flows } from '../../../../lib/collections/flows.js';
import { Contradictions } from '../../../../lib/collections/contradictions.js';
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
        var thisActivityId = event.target.getAttribute('data-id');
        var thisActivityData = Activities.findOne({
            '_id': thisActivityId
        });
        Modal.show('Activity', function() {
            return {
                "project": thisProject._id,
                "process": thisActivityData.processId,
                "activity": thisActivityData.activityData.id,
                "mode": "edit"
            }
        });
    },
    // Show the div that enable the edit of flows
    'click .edit-flow': function(event, template) {
        event.preventDefault();
        var thisFlow = Flows.findOne({ '_id': event.currentTarget.id });
        // Launch modal
        Modal.show('Flow', function() {
            return {
                "projectId": this.projectId,
                "flowId": event.currentTarget.id,
                "mode": "edit"
            }
        });
    },
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
        var activitiesToMap = Activities.find({
            'projectId': thisProject._id
        }).fetch();
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
        return JSON.stringify(data, null, '\t');
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
                "diff": JSON.stringify(JSON.parse(thisProject.versions[version].diff), null, '\t'),
            };
            prettifiedData.push(thisData);
        }

        return prettifiedData;
    },
    users: function() {
        return this.users;
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
    // Tooltips for the activites in the map tab
    $('.activities-without-location').tooltip({
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

        d3.xml(url).then(xml => {
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

    // Create a button for an activity
    var addActivityButton = function(x, y, radius, parent, buttonWidth, number, iconCode) {

        var button = parent.append("g");

        // Add the first circle
        button.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", radius);
        // Add the rect between the circles
        button.append("rect")
            .attr("x", x)
            .attr("y", y-radius)
            .attr("width", buttonWidth)
            .attr("height", radius*2);
        // Add the last circle
        button.append("circle")
            .attr("cx", x+buttonWidth)
            .attr("cy", y)
            .attr("r", radius);
        // Add the activity number
        button.append('text')
            .attr("x", x+radius/2)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .style("font-size", radius.toString() + "px")
            .text("#"+number);
        // Add the icon
        button.append('text')
            .attr("x", x+buttonWidth)
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
        var radius = 10;
        var buttonWidth = radius + activityData.number.toString().length * radius;
        var fullButtonWidth = buttonWidth+radius*2;
        var activityIconContainerWidth = 60;
        var activityIconContainerHeight = 85;

        // Add the main group
        var activity = parent.append("g");

        // Add the activity id
        activity.attr("data-activity-id", activityData.id);

        // Add the activity timeline
        var activityTimeline = activity.append("g").attr("class", "svg-activity-participation");
        var activityTimelineRect = activityTimeline.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", activityTimelineWidth)
            .attr("height", height);

        // Add participation level information to the activity timeline
        var participationLevelX = x + activityTimelineWidth / 2;
        var participationLevelY = y + activityTimelineWidth / 2;
        var participationLevelValue = 0;
        // Calculate the participationLevelValue
        switch (activityData.participation) {
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
        activityTimelineRect
            .attr("fill", participationLevelValueColorString)
            .style("stroke-width", "2px")
            .style("stroke", "#000");
        activityTimelineRect
            .attr("title", "Participation level: " + activityData.participation + " (" + participationLevelValue + "%)")
            .classed("participation-tooltip", true)
            .attr("data-toggle", "tooltip");
        // Add the participation level percentage text
        var participationLevel = activityTimeline.append("text")
            .text(participationLevelValue + "%")
            .attr("x", participationLevelX)
            .attr("y", participationLevelY)
            .attr("class", "participation-level");
        // Add the activity icon and button container
        var activityIconContainer = activity.append("g").attr("class", "svg-activity");
        // Add activity rectangle
        activityIconContainer.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", activityIconContainerWidth)
            .attr("height", activityIconContainerHeight)
            .style("stroke-width", "2px")
            .style("stroke", "#8f8f8f");
        // Add the activity icon
        var activityIcon = loadSVG("../as_full_nolabel_small.svg", activityIconContainer);
        var activityIconSize = { width: 55, height: 50};
        var centerHorizontalPadding = (activityIconContainerWidth-activityIconSize.width)/2;
        // Move it to x and y, and a 5 vertical padding from top
        activityIcon.attr("transform", "translate("+(x+centerHorizontalPadding)+","+(y+5)+")");
        //Find centers of activity elements
        activity.activityElementsCenters = {
            subject: {x: 15+(x+activityIconContainerWidth/2)-10, y: (y+5+activityIconSize.height/2)-18, title: "Subject"},
            object: {x: 15+(x+activityIconContainerWidth/2)+20, y: y+5+activityIconSize.height/2, title: "Object"},
            outcome: {x: 15+x+activityIconContainerWidth/2, y: y+5+activityIconSize.height/2, title: "Outcome"},
            tools: {x: 15+(x+activityIconContainerWidth/2)+10, y: (y+5+activityIconSize.height/2)-18, title: "Tools"},
            rules: {x: 15+(x+activityIconContainerWidth/2)-20, y: y+5+activityIconSize.height/2, title: "Rules"},
            roles: {x: 15+(x+activityIconContainerWidth/2)-10, y: (y+5+activityIconSize.height/2)+18, title: "Roles"},
            community: {x: 15+(x+activityIconContainerWidth/2)+10, y: (y+5+activityIconSize.height/2)+18, title: "Community"},
        }
        // Add activity ID data
        activity.id = activityData.id;
        var activityTooltips = activity.append("g");
        // Add transparent circles for tooltip
        for (i in activity.activityElementsCenters) {
            activityTooltips.append("circle")
                .attr("cx", activity.activityElementsCenters[i].x)
                .attr("cy", activity.activityElementsCenters[i].y)
                .attr("fill", "rgba(0, 0, 0, 0)")
                .attr("r", "7")
                .attr("title", activity.activityElementsCenters[i].title)
                .classed("activity-tooltip", true)
                .attr("data-toggle", "tooltip");

        }
        // Add the activity button
        var activityButton = addActivityButton(x, y, radius, activityIconContainer, buttonWidth, activityData.number, '\uf044');
        activityButton.attr("data-toggle", "modal")
            .classed("activity-button", true)
            .attr("title", "Edit this activity")
            .attr("data-activity-mode", "edit")
            .attr("data-activity-id", activityData.id)
            .attr("data-process-id", processData.id)
            .classed("button-tooltip", true)
            .attr("transform", "translate("+(fullButtonWidth/2)+","+(activityIconContainerHeight-radius*1.5)+")")
            .attr("data-toggle", "tooltip");
        // Move the whole activityIconContainer after the participation level
        activityIconContainer.attr("transform", "translate("+activityTimelineWidth+",0)")
        // Add a margin for the whole activity from the separator lines
        activity.attr("transform", "translate(" + activityTimelineMargin + ",0)");

        // Add class
        activity.attr("class", "activity-hover")
            // Add hover effect
            .on("mouseover", function() {
                d3.select(this)
                    .attr("filter", "url(#glow)");
            })
            .on("mouseout", function() {
                d3.select(this)
                    .attr("filter", null);
            })
            // Hide / show the activity icon on click
            .on("click", function(){
                if (activityIconContainer.style("display") === "inline") {
                    activityIconContainer.style("display", "none");
                    //Update centers of activity elements
                    activity.activityElementsCenters = {
                        subject: {x: x+activityTimelineWidth/2, y: y+activityTimelineWidth/2},
                        object: {x: x+activityTimelineWidth/2, y: y+activityTimelineWidth/2},
                        outcome: {x: x+activityTimelineWidth/2, y: y+activityTimelineWidth/2},
                        tools: {x: x+activityTimelineWidth/2, y: y+activityTimelineWidth/2},
                        rules: {x: x+activityTimelineWidth/2, y: y+activityTimelineWidth/2},
                        roles: {x: x+activityTimelineWidth/2, y: y+activityTimelineWidth/2},
                        community: {x: x+activityTimelineWidth/2, y: y+activityTimelineWidth/2},
                    }
                    // Hide tooltips
                    activityTooltips.style("display", "none");
                }
                else {
                    activityIconContainer.style("display", "inline");
                    //Update centers of activity elements
                    activity.activityElementsCenters = {
                        subject: {x: 15+(x+activityIconContainerWidth/2)-10, y: (y+5+activityIconSize.height/2)-18},
                        object: {x: 15+(x+activityIconContainerWidth/2)+20, y: y+5+activityIconSize.height/2},
                        outcome: {x: 15+x+activityIconContainerWidth/2, y: y+5+activityIconSize.height/2},
                        tools: {x: 15+(x+activityIconContainerWidth/2)+10, y: (y+5+activityIconSize.height/2)-18},
                        rules: {x: 15+(x+activityIconContainerWidth/2)-20, y: y+5+activityIconSize.height/2},
                        roles: {x: 15+(x+activityIconContainerWidth/2)-10, y: (y+5+activityIconSize.height/2)+18},
                        community: {x: 15+(x+activityIconContainerWidth/2)+10, y: (y+5+activityIconSize.height/2)+18},
                    }
                    // Show tooltips
                    activityTooltips.style("display", "inline");
                }
            });

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

        // Activities to be drawn
        var vizActivities = [];

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
        sectionCalculatedWidth = (d3Container.clientWidth - margin.left - simpleGutter) / (thisProject.processes.length);

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
                // Get the activity data
                activityData = thisUpdatedProject.processes[process]["activities"][activity];
                processData = thisUpdatedProject.processes[process];
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
                // Add / draw the activity
                var thisActivity = addActivity(sectionX, labelHeight + yScale(activityData.time.start), yScale(activityData.time.end), sectionsSVG, activityData, thisUpdatedProject.processes[process]);
                // Add it to the list of activities
                vizActivities.push(thisActivity);
                // For flows and issues: add 5 to x (the borders of the rects)
                for (i in thisActivity.activityElementsCenters) {
                    sectionsSVG.append("circle")
                        .attr("cx", thisActivity.activityElementsCenters[i].x+4)
                        .attr("cy", thisActivity.activityElementsCenters[i].y)
                        .attr("fill", "green")
                        .attr("r", 0);
                }
            }
        }
        // Draw the flows
        var flowsGroup = sectionsSVG.append("g");
        for (flow in thisUpdatedProject.flows) {
            // Get the ids of the nodes in the flow
            firstNode = thisUpdatedProject.flows[flow].firstNode;
            secondNode = thisUpdatedProject.flows[flow].secondNode;
            // Get the activity center of the node in the flow
            var firstNodeCenter;
            var secondNodeCenter;
            for (activity in vizActivities) {
                if (vizActivities[activity].id === firstNode) {
                    firstNodeCenter = vizActivities[activity].activityElementsCenters.outcome;
                }
                if (vizActivities[activity].id === secondNode) {
                    secondNodeCenter = vizActivities[activity].activityElementsCenters.outcome;
                }
            }
            //flowsGroup
            var flowColor = "#73f17b";
            var thisFlow = flowsGroup.append("g").attr("id", thisUpdatedProject.flows[flow].id);
            thisFlow.append("circle")
                .attr("cx", firstNodeCenter.x+4)
                .attr("cy", firstNodeCenter.y)
                .attr("fill", flowColor)
                .attr("r", 3);
            thisFlow.append("circle")
                .attr("cx", secondNodeCenter.x+4)
                .attr("cy", secondNodeCenter.y)
                .attr("fill", flowColor)
                .attr("r", 3);
            // Line
            var line = d3.line()
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                .curve(d3.curveBasis);
            // TODO: calculate the points...
            var points = [
                {x: firstNodeCenter.x+4, y: firstNodeCenter.y},
                {x: secondNodeCenter.x+4, y: firstNodeCenter.y},
                {x: secondNodeCenter.x+4, y: secondNodeCenter.y},
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
            var pathMidPoint = flowViz.node().getPointAtLength(flowViz.node().getTotalLength()*0.5);
            var flowVizMidPoint = thisFlow.append("circle")
                .attr("fill", flowColor)
                .attr("r", 8)
                .attr("cx", pathMidPoint.x)
                .attr("cy", pathMidPoint.y);
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

        // TODO Draw the issues

        // FINAL STEPS
        // Implement zoom and pan
        function zoomed() {
            sectionsSVG.attr("transform", d3.event.transform);
        }
        var d3width = +d3Container.clientWidth - margin.left - margin.right;
        var d3height = +d3Container.clientHeight - margin.top - margin.bottom;
        var zoom = d3.zoom()
            .scaleExtent([1, 3])
            .translateExtent([
                [-margin.left, -margin.top],
                [d3width, d3height]
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

    });
});

Template.ProjectsViz.onDestroyed(function() {});

// Import Leaflet
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Import collections
import { Projects } from '../../../../lib/collections/projects.js';
import { Activities } from '../../../../lib/collections/activities.js';
import { ActivityElements } from '../../../../lib/collections/activity_elements.js';
import { Flows } from '../../../../lib/collections/flows.js';
import { Contradictions } from '../../../../lib/collections/contradictions.js';
import { Settings } from '../../../../lib/collections/settings.js';
/*****************************************************************************/
/* VizLocations: Event Handlers */
/*****************************************************************************/
Template.VizLocations.events({
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
    'click .activities-without-location': function(event) {
        event.preventDefault();
        var thisActivityId = event.target.getAttribute('data-id');
        var thisActivityData = Activities.findOne({
            '_id': thisActivityId
        });
        Modal.show('Activity', function(event) {
            return {
                "project": thisProject._id,
                "process": thisActivityData.processId,
                "activity": thisActivityData.activityData.id,
                "mode": "edit"
            }
        });
    },
});

/*****************************************************************************/
/* VizLocations: Helpers */
/*****************************************************************************/
Template.VizLocations.helpers({
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
    noActivities: function() {
        var activitiesToMap = Activities.find({
            'projectId': thisProject._id
        }).fetch();
        if (activitiesToMap.length == 0) {
            return true;
        } else {
            return false;
        }
    },
    activitiesWithLocation: function() {
        var activitiesWithLocation = [];
        var activitiesToMap = Activities.find({
            'projectId': thisProject._id
        }).fetch();
        for (activity in activitiesToMap) {
            // If the activity hasn't a location
            if (typeof activitiesToMap[activity].activityData.location == "undefined") {
                activitiesWithLocation.push(activitiesToMap[activity].activityData);
            }
        }
        if (activitiesWithLocation.length == 0) {
            return true;
        } else {
            return false;
        }
    },
    noActivitiesWithoutLocation: function() {
        var activitiesWithoutLocation = [];
        var activitiesToMap = Activities.find({
            'projectId': thisProject._id
        }).fetch();
        for (activity in activitiesToMap) {
            // If the activity hasn't a location
            if (typeof activitiesToMap[activity].activityData.location !== "undefined") {
                activitiesWithoutLocation.push(activitiesToMap[activity].activityData);
            }
        }
        if (activitiesWithoutLocation.length == 0) {
            return true;
        } else {
            return false;
        }

    },
});

/*****************************************************************************/
/* VizLocations: Lifecycle Hooks */
/*****************************************************************************/
Template.VizLocations.onCreated(function () {
    // Access settings
    Meteor.subscribe('settings');
    // Access this specific project
    self.subscription = Meteor.subscribe('projects');
    thisProject = this.data;
});

Template.VizLocations.onRendered(function () {
    // Tooltips for the activites in the map tab
    $('.activities-without-location').tooltip({
        trigger: 'hover',
        placement: 'top'
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
                // If there are markers
                if (typeof markersGroup !== "undefined") {
                    var markersGroup = L.featureGroup(markersArray).addTo(locationsMap);
                    setTimeout(function() {
                        locationsMap.fitBounds(markersGroup.getBounds());
                    }, 1000);
                }

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
});

Template.VizLocations.onDestroyed(function () {
});

// Import Leaflet
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Import collections
import { Activities } from '../../../../lib/collections/activities.js';

/*****************************************************************************/
/* Locations: Event Handlers */
/*****************************************************************************/
Template.Locations.events({
});

/*****************************************************************************/
/* Locations: Helpers */
/*****************************************************************************/
Template.Locations.helpers({
    activities: function() {
        // Return only the activities in the current project
        return Activities.find({ 'projectId': this._id }).fetch();
    },
});

/*****************************************************************************/
/* Locations: Lifecycle Hooks */
/*****************************************************************************/
Template.Locations.onCreated(function () {
});

Template.Locations.onRendered(function () {
    var mymap = L.map('locationsMap').setView([51.505, -0.09], 13);
    // Tiles: http://leaflet-extras.github.io/leaflet-providers/preview/#filter=Esri.WorldGrayCanvas
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
		maxZoom: 16,
		attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	}).addTo(mymap);
});

Template.Locations.onDestroyed(function () {
});

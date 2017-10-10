import { Settings } from '../lib/collections/settings.js';

Meteor.startup(function() {
    // Insert a default settings if not present
    if (Settings.find().count() === 0) {
        Settings.insert({
            GoogleMapsAPIkey: "xxxx"
        });
    }
});

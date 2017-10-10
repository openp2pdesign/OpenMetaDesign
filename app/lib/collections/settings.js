export const Settings = new Mongo.Collection('settings');

import SimpleSchema from 'simpl-schema';

Settings.allow({
    insert: function(userId) {
        // Can only insert if admin.
        return Roles.userIsInRole(userId, ['admin']);
    },

    update: function(userId) {
        // Can only update if admin.
        return Roles.userIsInRole(userId, ['admin']);
    },

    remove: function(userId) {
        // Can only remove if admin.
        return Roles.userIsInRole(userId, ['admin']);
    }
});

SettingsSchema = new SimpleSchema({
    GoogleMapsAPIkey: {
        type: String,
        label: "Google Maps API Key"
    }
});

// Attach the SettingsSchema to the settings collection
Settings.attachSchema(SettingsSchema);

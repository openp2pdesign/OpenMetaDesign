// Collections
import { Settings } from '../../../lib/collections/settings.js';

/*****************************************************************************/
/* PrivacyPage: Event Handlers */
/*****************************************************************************/
Template.PrivacyPage.events({
});

/*****************************************************************************/
/* PrivacyPage: Helpers */
/*****************************************************************************/
Template.PrivacyPage.helpers({
    settingsData: function() {
        return Settings.findOne();
    }
});

/*****************************************************************************/
/* PrivacyPage: Lifecycle Hooks */
/*****************************************************************************/
Template.PrivacyPage.onCreated(function () {
    // Access settings
    Meteor.subscribe('settings');
});

Template.PrivacyPage.onRendered(function () {
});

Template.PrivacyPage.onDestroyed(function () {
});

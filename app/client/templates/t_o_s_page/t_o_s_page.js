// Collections
import { Settings } from '../../../lib/collections/settings.js';

/*****************************************************************************/
/* TOSPage: Event Handlers */
/*****************************************************************************/
Template.TOSPage.events({
});

/*****************************************************************************/
/* TOSPage: Helpers */
/*****************************************************************************/
Template.TOSPage.helpers({
    settingsData: function() {
        return Settings.findOne();
    }
});

/*****************************************************************************/
/* TOSPage: Lifecycle Hooks */
/*****************************************************************************/
Template.TOSPage.onCreated(function () {
    // Access settings
    Meteor.subscribe('settings');
});

Template.TOSPage.onRendered(function () {
});

Template.TOSPage.onDestroyed(function () {
});

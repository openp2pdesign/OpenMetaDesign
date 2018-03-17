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
});

Template.Locations.onDestroyed(function () {
});

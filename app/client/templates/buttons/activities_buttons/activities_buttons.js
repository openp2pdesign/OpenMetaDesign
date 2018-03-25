import { Activities } from '../../../../lib/collections/activities.js';

/*****************************************************************************/
/* ActivitiesButtons: Event Handlers */
/*****************************************************************************/
Template.ActivitiesButtons.events({
    // Launch the modal for the activity
    'click .edit-activity': function(event, template) {
        event.preventDefault();
        // Get IDs of project, process, activity
        var thisActivityID = this._id;
        var thisActivity = Activities.findOne({ '_id':thisActivityID });
        var thisProjectID = thisActivity.projectId;
        var thisProcessID = thisActivity.processId;
        // Launch the modal
        Modal.show('Activity', function() {
            return {
                "project": thisProjectID,
                "process": thisProcessID,
                "activity": thisActivityID,
                "mode": "edit"
            }
        });
    },
});

/*****************************************************************************/
/* ActivitiesButtons: Helpers */
/*****************************************************************************/
Template.ActivitiesButtons.helpers({
});

/*****************************************************************************/
/* ActivitiesButtons: Lifecycle Hooks */
/*****************************************************************************/
Template.ActivitiesButtons.onCreated(function () {
});

Template.ActivitiesButtons.onRendered(function () {
});

Template.ActivitiesButtons.onDestroyed(function () {
});

/*****************************************************************************/
/* ActivityView: Event Handlers */
/*****************************************************************************/
Template.ActivityView.events({
});

/*****************************************************************************/
/* ActivityView: Helpers */
/*****************************************************************************/
Template.ActivityView.helpers({
    data: function() {
        // Return helper values for the template
        return {
            "project": thisProject,
            "process": this.process,
            "activity": thisActivity
        }
    }
});

/*****************************************************************************/
/* ActivityView: Lifecycle Hooks */
/*****************************************************************************/
Template.ActivityView.onCreated(function () {
});

Template.ActivityView.onRendered(function () {
});

Template.ActivityView.onDestroyed(function () {
});

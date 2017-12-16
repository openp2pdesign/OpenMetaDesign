/*****************************************************************************/
/* ActivityEdit: Event Handlers */
/*****************************************************************************/
Template.ActivityEdit.events({
});

/*****************************************************************************/
/* ActivityEdit: Helpers */
/*****************************************************************************/
Template.ActivityEdit.helpers({
    data: function() {
        // Return helper values for the template
        return {
            "project": thisProject,
            "process": this.process,
            "activity": defaultActivity
        }
    }
});

/*****************************************************************************/
/* ActivityEdit: Lifecycle Hooks */
/*****************************************************************************/
Template.ActivityEdit.onCreated(function () {
});

Template.ActivityEdit.onRendered(function () {
});

Template.ActivityEdit.onDestroyed(function () {
});

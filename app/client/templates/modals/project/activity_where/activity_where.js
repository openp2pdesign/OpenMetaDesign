/*****************************************************************************/
/* ActivityWhere: Event Handlers */
/*****************************************************************************/
Template.ActivityWhere.events({
});

/*****************************************************************************/
/* ActivityWhere: Helpers */
/*****************************************************************************/
Template.ActivityWhere.helpers({
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
/* ActivityWhere: Lifecycle Hooks */
/*****************************************************************************/
Template.ActivityWhere.onCreated(function () {
});

Template.ActivityWhere.onRendered(function () {
});

Template.ActivityWhere.onDestroyed(function () {
});

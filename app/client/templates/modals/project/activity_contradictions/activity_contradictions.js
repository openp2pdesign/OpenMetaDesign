/*****************************************************************************/
/* ActivityContradictions: Event Handlers */
/*****************************************************************************/
Template.ActivityContradictions.events({
});

/*****************************************************************************/
/* ActivityContradictions: Helpers */
/*****************************************************************************/
Template.ActivityContradictions.helpers({
    data: function() {
        // Return helper values for the template
        return {
            "project": thisProject,
            "process": this.process,
            "activity": thisActivity
        }
    },
    thisProjectContradictions: function() {
        return thisProject.contradictions;
    },
});

/*****************************************************************************/
/* ActivityContradictions: Lifecycle Hooks */
/*****************************************************************************/
Template.ActivityContradictions.onCreated(function () {
});

Template.ActivityContradictions.onRendered(function () {
});

Template.ActivityContradictions.onDestroyed(function () {
});

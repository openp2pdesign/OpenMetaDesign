/*****************************************************************************/
/* ActivityContradictions: Event Handlers */
/*****************************************************************************/
Template.ActivityContradictions.events({
});

/*****************************************************************************/
/* ActivityContradictions: Helpers */
/*****************************************************************************/
Template.ActivityContradictions.helpers({
    thisProjectContradictions: function() {
        return this.project.contradictions;
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

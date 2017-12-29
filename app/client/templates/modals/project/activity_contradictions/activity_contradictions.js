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
            "activity": defaultActivity
        }
    },
    thisProjectContradictions: function() {
        contradictions = [];
        // cycle all the processes
        for (process in thisProject.processes) {
            // get the .contradictions of each of them
            contradictions.push(thisProject.processes[process].contradictions)
        }
        return contradictions;
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

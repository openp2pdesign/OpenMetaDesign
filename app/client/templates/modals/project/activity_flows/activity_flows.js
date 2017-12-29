/*****************************************************************************/
/* ActivityFlows: Event Handlers */
/*****************************************************************************/
Template.ActivityFlows.events({
    // Show the div that enable the creation of flows
    'click #create-flow-button': function(event, template) {
        event.preventDefault();
        $("#createFlowDiv").show();
    },
    // Save the flow and hide the form
    'click #save-flow-button': function(event, template) {
        event.preventDefault();
        // save the flow here
        $("#createFlowDiv").hide();
    },
});

/*****************************************************************************/
/* ActivityFlows: Helpers */
/*****************************************************************************/
Template.ActivityFlows.helpers({
    data: function() {
        // Return helper values for the template
        return {
            "project": thisProject,
            "process": this.process,
            "activity": defaultActivity
        }
    },
    thisProjectFlows: function() {
        flows = [];
        // cycle all the processes
        for (process in thisProject.processes) {
            // get the .flows of each of them
            flows.push(thisProject.processes[process].flows)
        }
        return flows;
    },
});

/*****************************************************************************/
/* ActivityFlows: Lifecycle Hooks */
/*****************************************************************************/
Template.ActivityFlows.onCreated(function() {});

Template.ActivityFlows.onRendered(function() {
    // Hide the divs that enable the edit, view, delete of flows by default
    $("#createFlowDiv").hide();
});

Template.ActivityFlows.onDestroyed(function() {});

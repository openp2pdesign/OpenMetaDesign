/*****************************************************************************/
/* FlowButtons: Event Handlers */
/*****************************************************************************/
Template.FlowButtons.events({
    // Show the div that enable the delete of flows
    'click .delete-flow': function(event, template) {
        event.preventDefault();
        $("#deleteFlowDiv").show();
        $("#createFlowDiv").hide();
        // Pass the flow id to Sessions
        Session.set('flowToDelete', this.id);
    },
    // Show the div that enable the edit of flows
    'click .edit-flow': function(event, template) {
        event.preventDefault();
        $("#editFlowDiv").show();
        $("#deleteFlowDiv").hide();
        $("#createFlowDiv").hide();
        // Pass the flow id to Sessions
        Session.set('flowToEdit', this.id);
    },
});

/*****************************************************************************/
/* FlowButtons: Helpers */
/*****************************************************************************/
Template.FlowButtons.helpers({
});

/*****************************************************************************/
/* FlowButtons: Lifecycle Hooks */
/*****************************************************************************/
Template.FlowButtons.onCreated(function () {
});

Template.FlowButtons.onRendered(function () {
});

Template.FlowButtons.onDestroyed(function () {
});

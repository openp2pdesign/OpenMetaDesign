/*****************************************************************************/
/* FlowButtons: Event Handlers */
/*****************************************************************************/
Template.FlowButtons.events({
    // Show the div that enable the delete of flows
    'click .delete-flow': function(event, template) {
        event.preventDefault();
        $("#showFlowDiv").hide();
        $("#editFlowDiv").hide();
        $("#deleteFlowDiv").show();
        $("#createFlowDiv").hide();
        // Pass the flow id to Sessions
        Session.set('flowToDeleteData', this);
    },
    // Show the div that enable the edit of flows
    'click .edit-flow': function(event, template) {
        event.preventDefault();
        $("#showFlowDiv").hide();
        $("#editFlowDiv").show();
        $("#deleteFlowDiv").hide();
        $("#createFlowDiv").hide();
        // Pass the flow id to Sessions
        Session.set('flowToEditData', this);
    },
    // Show the div that enable the edit of flows
    'click .show-flow': function(event, template) {
        event.preventDefault();
        $("#showFlowDiv").show();
        $("#editFlowDiv").hide();
        $("#deleteFlowDiv").hide();
        $("#createFlowDiv").hide();
        // Pass the flow id to Sessions
        Session.set('flowToShowData', this);
    },
    // Show the div that enable the edit of flows
    'click .create-flow': function(event, template) {
        event.preventDefault();
        $("#showFlowDiv").hide();
        $("#editFlowDiv").hide();
        $("#deleteFlowDiv").hide();
        $("#createFlowDiv").show();
        // Pass the flow id to Sessions
        Session.set('flowToEditData', this);
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

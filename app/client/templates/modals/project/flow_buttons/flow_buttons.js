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
        $("#discussFlowDiv").hide();
        // Pass the flow id to Sessions
        Session.set('flowToDeleteData', this._id);
    },
    // Show the div that enable the edit of flows
    'click .edit-flow': function(event, template) {
        event.preventDefault();
        $("#showFlowDiv").hide();
        $("#editFlowDiv").show();
        $("#deleteFlowDiv").hide();
        $("#createFlowDiv").hide();
        $("#discussFlowDiv").hide();
        // Pass the flow id to Sessions
        Session.set('flowToShowData', this._id);
    },
    // Show the div that enable the edit of flows
    'click .show-flow': function(event, template) {
        event.preventDefault();
        $("#showFlowDiv").show();
        $("#editFlowDiv").hide();
        $("#deleteFlowDiv").hide();
        $("#createFlowDiv").hide();
        $("#discussFlowDiv").hide();
        // Pass the flow id to Sessions
        Session.set('flowToShowData', this._id);
    },
    // Show the div that enable the edit of flows
    'click .create-flow': function(event, template) {
        event.preventDefault();
        $("#showFlowDiv").hide();
        $("#editFlowDiv").hide();
        $("#deleteFlowDiv").hide();
        $("#createFlowDiv").show();
        $("#discussFlowDiv").hide();
    },
    // Show the div that enable the discussions of flows
    'click .discuss-flow': function(event, template) {
        event.preventDefault();
        $("#showFlowDiv").hide();
        $("#editFlowDiv").hide();
        $("#deleteFlowDiv").hide();
        $("#createFlowDiv").hide();
        $("#discussFlowDiv").show();
    }
});

/*****************************************************************************/
/* FlowButtons: Helpers */
/*****************************************************************************/
Template.FlowButtons.helpers({});

/*****************************************************************************/
/* FlowButtons: Lifecycle Hooks */
/*****************************************************************************/
Template.FlowButtons.onCreated(function() {});

Template.FlowButtons.onRendered(function() {});

Template.FlowButtons.onDestroyed(function() {});

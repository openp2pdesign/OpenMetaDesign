import { Flows } from '../../../../lib/collections/flows.js';

/*****************************************************************************/
/* FlowButtons: Event Handlers */
/*****************************************************************************/
Template.FlowButtons.events({
    // Show the div that enable the edit of flows
    'click .edit-flow': function(event, template) {
        event.preventDefault();
        var thisFlow = Flows.findOne({ '_id': template.data._id });
        // Launch modal
        Modal.show('Flow', function() {
            return {
                "projectId": thisFlow.projectId,
                "flowId": template.data._id,
                "mode": "edit"
            }
        });
    },
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

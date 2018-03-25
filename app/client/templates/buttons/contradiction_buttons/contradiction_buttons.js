import { Contradictions } from '../../../../lib/collections/contradictions.js';

/*****************************************************************************/
/* ContradictionButtons: Event Handlers */
/*****************************************************************************/
Template.ContradictionButtons.events({
    // Show the div that enable the edit of contradictions
    'click .edit-contradiction': function(event, template) {
        event.preventDefault();
        var thisContradiction = Contradictions.findOne({ '_id': template.data._id });
        // Launch modal
        Modal.show('Contradiction', function() {
            return {
                "projectId": thisContradiction.projectId,
                "contradictionId": template.data._id,
                "mode": "edit"
            }
        });
    },
});

/*****************************************************************************/
/* ContradictionButtons: Helpers */
/*****************************************************************************/
Template.ContradictionButtons.helpers({});

/*****************************************************************************/
/* ContradictionButtons: Lifecycle Hooks */
/*****************************************************************************/
Template.ContradictionButtons.onCreated(function() {});

Template.ContradictionButtons.onRendered(function() {});

Template.ContradictionButtons.onDestroyed(function() {});

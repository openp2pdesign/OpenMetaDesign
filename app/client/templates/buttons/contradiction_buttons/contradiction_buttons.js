/*****************************************************************************/
/* ContradictionButtons: Event Handlers */
/*****************************************************************************/
Template.ContradictionButtons.events({
    // Show the div that enable the edit of contradictions
    'click .edit-contradiction': function(event, template) {
        event.preventDefault();
        // Launch modal
        Modal.show('Contradiction', function() {
            return {
                "contradictionId": template.data._id
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

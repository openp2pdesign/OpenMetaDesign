/*****************************************************************************/
/* ContradictionButtons: Event Handlers */
/*****************************************************************************/
Template.ContradictionButtons.events({
    // Show the div that enable the edit of contradictions
    'click .edit-contradiction': function(event, template) {
        event.preventDefault();
        // Set the discuss to show to the main activity
        Session.set('discussionToShow', Session.get('thisProject') + "-" + template.data._id);
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

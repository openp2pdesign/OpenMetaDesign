/*****************************************************************************/
/* ContradictionButtons: Event Handlers */
/*****************************************************************************/
Template.ContradictionButtons.events({
    // Show the div that enable the edit of contradictions
    'click .edit-contradiction': function(event, template) {
        event.preventDefault();
        Modal.show('Contradiction', function() {
            return {
                "mode": "edit"
            }
        });
        $("#showContradictionDiv").hide();
        $("#editContradictionDiv").show();
        $("#deleteContradictionDiv").hide();
        $("#createContradictionDiv").hide();
        $("#discussContradictionDiv").hide();
        // Set the discuss to show to the main activity
        Session.set('discussionToShow', Session.get('thisProject') + "-" + Session.get('thisActivity'));
        // Pass the contradiction id to Sessions
        Session.set('contradictionToShowData', this._id);
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

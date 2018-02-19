/*****************************************************************************/
/* ContradictionButtons: Event Handlers */
/*****************************************************************************/
Template.ContradictionButtons.events({
    // Show the div that enable the delete of contradictions
    'click .delete-contradiction': function(event, template) {
        event.preventDefault();
        $("#showContradictionDiv").hide();
        $("#editContradictionDiv").hide();
        $("#deleteContradictionDiv").show();
        $("#createContradictionDiv").hide();
        // Pass the contradiction id to Sessions
        Session.set('contradictionToDeleteData', this._id);
    },
    // Show the div that enable the edit of contradictions
    'click .edit-contradiction': function(event, template) {
        event.preventDefault();
        $("#showContradictionDiv").hide();
        $("#editContradictionDiv").show();
        $("#deleteContradictionDiv").hide();
        $("#createContradictionDiv").hide();
        // Pass the contradiction id to Sessions
        Session.set('contradictionToEditData', this._id);
    },
    // Show the div that enable the edit of contradictions
    'click .show-contradiction': function(event, template) {
        event.preventDefault();
        $("#showContradictionDiv").show();
        $("#editContradictionDiv").hide();
        $("#deleteContradictionDiv").hide();
        $("#createContradictionDiv").hide();
        // Pass the contradiction id to Sessions
        Session.set('contradictionToShowData', this._id);
    },
    // Show the div that enable the edit of contradictions
    'click .create-contradiction': function(event, template) {
        event.preventDefault();
        $("#showContradictionDiv").hide();
        $("#editContradictionDiv").hide();
        $("#deleteContradictionDiv").hide();
        $("#createContradictionDiv").show();
        // Pass the contradiction id to Sessions
        Session.set('contradictionToEditData', this._id);
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

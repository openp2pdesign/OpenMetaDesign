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
        $("#discussContradictionDiv").hide();
        // Set the discuss to show to the main activity
        Session.set('discussionToShow', Session.get('thisProject') + "-" + Session.get('thisActivity'));
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
        $("#discussContradictionDiv").hide();
        // Set the discuss to show to the main activity
        Session.set('discussionToShow', Session.get('thisProject') + "-" + Session.get('thisActivity'));
        // Pass the contradiction id to Sessions
        Session.set('contradictionToShowData', this._id);
    },
    // Show the div that enable the edit of contradictions
    'click .show-contradiction': function(event, template) {
        event.preventDefault();
        $("#showContradictionDiv").show();
        $("#editContradictionDiv").hide();
        $("#deleteContradictionDiv").hide();
        $("#createContradictionDiv").hide();
        $("#discussContradictionDiv").hide();
        // Set the discuss to show to the main activity
        Session.set('discussionToShow', Session.get('thisProject') + "-" + Session.get('thisActivity'));
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
        $("#discussContradictionDiv").hide();
        // Set the discuss to show to the main activity
        Session.set('discussionToShow', Session.get('thisProject') + "-" + Session.get('thisActivity'));
    },
    // Show the div that enable the discussions of contradictions
    'click .discuss-contradiction': function(event, template) {
        event.preventDefault();
        $("#showContradictionDiv").hide();
        $("#editContradictionDiv").hide();
        $("#deleteContradictionDiv").hide();
        $("#createContradictionDiv").hide();
        $("#discussContradictionDiv").show();
        // Set the discuss to show to the contradiction
        Session.set('discussionToShow', Session.get('thisProject') + "-" + this._id);
        // Reload the discussion
        // Empty the div
        $("#contradictionDiscussDiv").empty();
        // Reload template with new data
        Blaze.render(Template.Discuss, document.getElementById('contradictionDiscussDiv'));
    }
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

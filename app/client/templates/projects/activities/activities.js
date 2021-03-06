/*****************************************************************************/
/* Activities: Event Handlers */
/*****************************************************************************/
Template.Activities.events({
    'click #create-activity-button': function(event, template) {
        event.preventDefault();
        var thisProjectID = this._id;
        // Launch the modal
        Modal.show('Activity', function() {
            return {
                "project": thisProjectID,
                "process": "none",
                "activity": 'new activity',
                "mode": "add"
            }
        });
    },
});

/*****************************************************************************/
/* Activities: Helpers */
/*****************************************************************************/
Template.Activities.helpers({
    tabularSelector: function() {
        return {'projectId': this._id};
    },
    processes: function() {
        return this.processes;
    },
});

/*****************************************************************************/
/* Activities: Lifecycle Hooks */
/*****************************************************************************/
Template.Activities.onCreated(function () {
});

Template.Activities.onRendered(function () {
    // Enable select2
    $('.select2-dropdown').select2({
        dropdownAutoWidth: true,
        width: '100%'
    });
});

Template.Activities.onDestroyed(function () {
});

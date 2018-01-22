// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";
// jquery
import { $ } from 'meteor/jquery';
// Random id
import { Random } from 'meteor/random';
// Load Projects and Settings
import { Projects } from '../../../../../lib/collections/projects.js';
import { Settings } from '../../../../../lib/collections/settings.js';

/*****************************************************************************/
/* ActivityEdit: Event Handlers */
/*****************************************************************************/
Template.ActivityEdit.events({
    'click #save-activity-button': function(event) {
        event.preventDefault();
        // Load data from the form
        var thisActivityId = $('#activity-id').data('id');
        var newTitle = $('#new-title').val();
        var newDescription = $('#new-description').val();
        var newSubject = $('#new-subject').val();
        var newObject = $('#new-object').val();
        var newOutcome = $('#new-outcome').val();
        var newTools = $('#new-tools').val();
        var newSubject = $('#new-subject').val();
        var newRoles = $('#new-roles').val();
        var newRules = $('#new-rules').val();
        var newCommunity = $('#new-community').val();
        var newParticipation = $('#new-participation').val();
        var newTimeStart = $("#new-time-start").data("DateTimePicker").date().toDate();
        var newTimeEnd = $("#new-time-end").data("DateTimePicker").date().toDate();
        // Format data from the form as an object
        activityData = {
            "title": newTitle,
            "description": newDescription,
            "subject": {"title": "subject", "description": newSubject},
            "object": {"title": "object", "description": newObject},
            "outcome": {"title": "outcome", "description": newOutcome},
            "tools": {"title": "tools", "description": newTools},
            "rules": {"title": "rules", "description": newRules},
            "roles": {"title": "roles", "description": newRoles},
            "community": {"title": "community", "description": newCommunity},
            "time": {
                "start": newTimeStart,
                "end": newTimeEnd
            },
            "participation": newParticipation
        }

        // Add a new activity
        if (this.mode == "add") {
            // Create a random id for a new activity
            newID = Random.id();
            // Validate and save new data
            Meteor.call('addActivity', this.project._id, this.process.id, newID, activityData, function(error, result) {
                if (error) {
                    var errorNotice = new PNotify({
                        type: 'error',
                        title: 'Error',
                        text: 'There was an error in adding the activity',
                        icon: 'fa fa-cubes',
                        addclass: 'pnotify stack-topright',
                        animate: {
                            animate: true,
                            in_class: 'slideInDown',
                            out_class: 'slideOutUp'
                        },
                        buttons: {
                            closer: true,
                            sticker: false
                        }
                    });
                    errorNotice.get().click(function() {
                        errorNotice.remove();
                    });
                } else {
                    var successNotice = new PNotify({
                        type: 'success',
                        title: 'Success',
                        text: 'Activity successfully added.',
                        icon: 'fa fa-cubes',
                        addclass: 'pnotify stack-topright',
                        animate: {
                            animate: true,
                            in_class: 'slideInDown',
                            out_class: 'slideOutUp'
                        },
                        buttons: {
                            closer: true,
                            sticker: false
                        }
                    });

                    successNotice.get().click(function() {
                        successNotice.remove();
                    });
                }
            });
        }
        // Edit an existing activity
        else if (this.mode == "edit") {
            // Validate and save new data
            Meteor.call('editActivity', this.project._id, this.process.id, thisActivityId, activityData, function(error, result) {
                if (error) {
                    var errorNotice = new PNotify({
                        type: 'error',
                        title: 'Error',
                        text: 'There was an error in adding the activity',
                        icon: 'fa fa-cubes',
                        addclass: 'pnotify stack-topright',
                        animate: {
                            animate: true,
                            in_class: 'slideInDown',
                            out_class: 'slideOutUp'
                        },
                        buttons: {
                            closer: true,
                            sticker: false
                        }
                    });

                    errorNotice.get().click(function() {
                        errorNotice.remove();
                    });
                } else {
                    var successNotice = new PNotify({
                        type: 'success',
                        title: 'Success',
                        text: 'Activity successfully added.',
                        icon: 'fa fa-cubes',
                        addclass: 'pnotify stack-topright',
                        animate: {
                            animate: true,
                            in_class: 'slideInDown',
                            out_class: 'slideOutUp'
                        },
                        buttons: {
                            closer: true,
                            sticker: false
                        }
                    });

                    successNotice.get().click(function() {
                        successNotice.remove();
                    });
                }
            });
        }

    }
});

/*****************************************************************************/
/* ActivityEdit: Helpers */
/*****************************************************************************/
Template.ActivityEdit.helpers({
    data: function() {
        // Return helper values for the template
        return {
            "project": thisProject,
            "process": thisProcess,
            "activity": thisActivity,
            "mode": this.mode
        }
    }
});

/*****************************************************************************/
/* ActivityEdit: Lifecycle Hooks */
/*****************************************************************************/
Template.ActivityEdit.onCreated(function() {
    // Access projects
    self.subscription = Meteor.subscribe('projects');
    // Load contents (already loaded in activity.js)
    thisProject = this.data.project;
    thisProcess = this.data.process;
    thisActivity = this.data.activity;
});

Template.ActivityEdit.onRendered(function() {
    // Datetimepicker for start
    this.$('#new-time-start').datetimepicker({
        inline: true,
        sideBySide: false,
        format: 'LLL',
        defaultDate: thisActivity.time.start
    });
    // Datetimepicker for end
    this.$('#new-time-end').datetimepicker({
        inline: true,
        sideBySide: false,
        format: 'LLL',
        defaultDate: thisActivity.time.end
    });
    // Select2 for participation level
    $("#new-participation").select2({
        dropdownParent: $('#activity-add'),
        data: ["No participation",
            "Indirect participation",
            "Consultative participation",
            "Shared control",
            "Full control"
        ],
        allowClear: false,
    });
});

Template.ActivityEdit.onDestroyed(function() {});

// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";
// jquery
import { $ } from 'meteor/jquery';
// Random id
import {  Random } from 'meteor/random';
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
        var thisActivityNumber = $('#activity-number').data('id');
        var newTitle = $('#new-title').val();
        var newDescription = $('#new-description').val();
        var newSubject = $('#new-subject').val();
        var newSubjectId = $('#new-subject').data('id');
        var newObject = $('#new-object').val();
        var newObjectId = $('#new-object').data('id');
        var newOutcome = $('#new-outcome').val();
        var newOutcomeId = $('#new-outcome').data('id');
        var newTools = $('#new-tools').val();
        var newToolsId = $('#new-tools').data('id');
        var newRoles = $('#new-roles').val();
        var newRolesId = $('#new-roles').data('id');
        var newRules = $('#new-rules').val();
        var newRulesId = $('#new-rules').data('id');
        var newCommunity = $('#new-community').val();
        var newCommunityId = $('#new-community').data('id');
        var newParticipation = $('#new-participation').val();
        var newTimeStart = $("#new-time-start").data("DateTimePicker").date().toDate();
        var newTimeEnd = $("#new-time-end").data("DateTimePicker").date().toDate();
        // Format data from the form as an object
        activityData = {
            "title": newTitle,
            "description": newDescription,
            "id": thisActivityId,
            "number": thisActivityNumber,
            "subject": {
                "title": "subject",
                "description": newSubject,
                "id": newSubjectId
            },
            "object": {
                "title": "object",
                "description": newObject,
                "id": newObjectId
            },
            "outcome": {
                "title": "outcome",
                "description": newOutcome,
                "id": newOutcomeId
            },
            "tools": {
                "title": "tools",
                "description": newTools,
                "id": newToolsId
            },
            "rules": {
                "title": "rules",
                "description": newRules,
                "id": newRulesId
            },
            "roles": {
                "title": "roles",
                "description": newRoles,
                "id": newRolesId
            },
            "community": {
                "title": "community",
                "description": newCommunity,
                "id": newCommunityId
            },
            "time": {
                "start": newTimeStart,
                "end": newTimeEnd
            },
            "participation": newParticipation
        }

        // Add a new activity
        if (this.mode == "add") {
            // Validate and save new data
            Meteor.call('addActivity', this.project._id, this.process.id, activityData, function(error, result) {
                if (error) {
                    var errorNotice = new PNotify({
                        type: 'error',
                        title: 'Error',
                        text: 'There was an error in adding the activity',
                        icon: 'icomoon-activity',
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
                        icon: 'icomoon-activity',
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
                        text: 'There was an error in editing the activity',
                        icon: 'icomoon-activity',
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
                        text: 'Activity successfully edited.',
                        icon: 'icomoon-activity',
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
            "activity": function() {
                if (this.mode == "edit") {
                    return thisActivity;
                } else {
                    thisActivity = {
                        "title": "A new activity",
                        "description": "Write here a description of the activity.",
                        "number": "",
                        "subject": {
                            "title": "subject",
                            "description": "Who is doing the activity?",
                            "id": Random.id()
                        },
                        "object": {
                            "title": "object",
                            "description": "What is the object of the activity?",
                            "id": Random.id()
                        },
                        "outcome": {
                            "title": "outcome",
                            "description": "What is the outcome of the activity?",
                            "id": Random.id()
                        },
                        "tools": {
                            "title": "tools",
                            "description": "Which are the tools, knowledge and systems used in the activity?",
                            "id": Random.id()
                        },
                        "rules": {
                            "title": "rules",
                            "description": "Which are the rules followed in the activity?",
                            "id": Random.id()
                        },
                        "roles": {
                            "title": "roles",
                            "description": "How is the work in the activity organized into roles?",
                            "id": Random.id()
                        },
                        "community": {
                            "title": "community",
                            "description": "Which is the greater community where the activity takes place?",
                            "id": Random.id()
                        },
                        "time": {
                            "start": new Date(),
                            "end": new Date()
                        },
                        "participation": "Full control"
                    }
                }
                return thisActivity;
            },
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
        data: ["No participation",
            "Indirect participation",
            "Consultative participation",
            "Shared control",
            "Full control"
        ],
        allowClear: false,
        dropdownAutoWidth : true
    });
});

Template.ActivityEdit.onDestroyed(function() {});

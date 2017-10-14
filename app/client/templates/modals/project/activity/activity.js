/*****************************************************************************/
/* Activity: Event Handlers */
/*****************************************************************************/

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

Template.Activity.events({
    'click #confirm': function(event) {
        event.preventDefault();

        newID = Random.id();
        var thisActivityId = newID;
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

        activityData = {
            "title": newTitle,
            "description": newDescription,
            "subject": newSubject,
            "object": newObject,
            "outcome": newOutcome,
            "tools": newTools,
            "rules": newRules,
            "roles": newRoles,
            "community": newCommunity,
            "time": {
                "start": newTimeStart,
                "end": newTimeEnd
            },
            "participation": newParticipation
        }

        // Add a new activity
        if (this.mode == "add") {
            // Validate and save new data
            Meteor.call('addActivity', this.project, this.process, newID, activityData, function(error, result){
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
                }
                else {
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
            Meteor.call('editActivity', this.project, this.process, this.activity, activityData, function(error, result){
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
                }
                else {
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
/* Activity: Helpers */
/*****************************************************************************/
Template.Activity.helpers({
    data: function() {
        // Return helper values for the template
        return {
            "project": thisProject,
            "process": this.process,
            "activity": defaultActivity
        }
    }

});

/*****************************************************************************/
/* Activity: Lifecycle Hooks */
/*****************************************************************************/
Template.Activity.onCreated(function() {
    // Access projects
    self.subscription = Meteor.subscribe('projects');
    // Load the current project
    var thisProject = Projects.findOne({
        '_id': this.project
    });
    // Default empty activity
    defaultActivity = {
        "title": "A new activity",
        "description": "Write here a description of the activity.",
        "subject": "Who is doing the activity?",
        "object": "What is the object of the activity?",
        "outcome": "What is the outcome of the activity?",
        "tools": "Which are the tools, knowledge and systems used in the activity?",
        "rules": "Which are the rules followed in the activity?",
        "roles": "How is the work in the activity organized into roles?",
        "community": "Which is the greater community where the activity takes place?",
        "time": {
            "start": new Date(),
            "end": new Date()
        },
        "participation": "Full control"
    }
});

Template.Activity.onRendered(function() {
    // Datetimepicker for start
    this.$('#new-time-start').datetimepicker({
        inline: true,
        sideBySide: false,
        format: 'LLL',
        defaultDate: defaultActivity.time.start
    });
    // Datetimepicker for end
    this.$('#new-time-end').datetimepicker({
        inline: true,
        sideBySide: false,
        format: 'LLL',
        defaultDate: defaultActivity.time.end
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

Template.Activity.onDestroyed(function() {});

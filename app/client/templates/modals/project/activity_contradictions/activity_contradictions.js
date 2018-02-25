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
import { Activities } from '../../../../../lib/collections/activities.js';
import { ActivityElements } from '../../../../../lib/collections/activity_elements.js';
import { Contradictions } from '../../../../../lib/collections/contradictions.js';

// Client only collection for the autocomplete
LocalActivityElements = new Mongo.Collection(null);

/*****************************************************************************/
/* ActivityContradictions: Event Handlers */
/*****************************************************************************/
Template.ActivityContradictions.events({
    // Show the div that enable the creation of contradictions
    'click #create-contradiction-button': function(event, template) {
        event.preventDefault();
        $("#createContradictionDiv").show();
    },
    // Save the contradiction and hide the form
    'click #create-save-contradiction-button': function(event, template) {
        event.preventDefault();
        // Get the data from the form
        var newTitle = $('#new-contradiction-title').val();
        var newDescription = $('#new-contradiction-description').val();

        var newFirstNode = $('#new-contradiction-first-node option:selected').attr('data-option');

        var newSecondNode = $('#new-contradiction-second-node option:selected').data('option');
        var newDirection = $('input[name=contradiction_direction]:checked').val();
        // Format data from the form as an object
        contradictionData = {
            "title": newTitle,
            "description": newDescription,
            "level": "TBD",
            "firstNode": newFirstNode,
            "secondNode": newSecondNode,
            "direction": newDirection
        }
        // Save the contradiction
        // Validate and save new data
        Meteor.call('addContradiction', this.project._id, contradictionData, function(error, result) {
            if (error) {
                var errorNotice = new PNotify({
                    type: 'error',
                    title: 'Error',
                    text: 'There was an error in adding the contradiction',
                    icon: 'fa fa-random',
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
                // Hide the form before the notification
                $("#createContradictionDiv").hide();
                var successNotice = new PNotify({
                    type: 'success',
                    title: 'Success',
                    text: 'Contradiction successfully added.',
                    icon: 'fa fa-random',
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
        // Hide the form
        $("#createContradictionDiv").hide();
    },
    // Cancel save the new contradiction
    'click #cancel-create-save-contradiction-button': function(event, template) {
        event.preventDefault();
        $("#createContradictionDiv").hide();
    },
    // Save the contradiction and hide the form
    'click #create-save-contradiction-button': function(event, template) {
        event.preventDefault();
        // Get the data from the form
        var newTitle = $('#new-contradiction-title').val();
        var newDescription = $('#new-contradiction-description').val();

        var newFirstNode = $('#new-contradiction-first-node option:selected').attr('data-option');

        var newSecondNode = $('#new-contradiction-second-node option:selected').data('option');
        var newDirection = $('input[name=contradiction_direction]:checked').val();
        // Format data from the form as an object
        contradictionData = {
            "title": newTitle,
            "description": newDescription,
            "level": "TBD",
            "firstNode": newFirstNode,
            "secondNode": newSecondNode,
            "direction": newDirection
        }
        // Save the contradiction
        // Validate and save new data
        Meteor.call('addContradiction', this.project._id, contradictionData, function(error, result) {
            if (error) {
                var errorNotice = new PNotify({
                    type: 'error',
                    title: 'Error',
                    text: 'There was an error in adding the contradiction',
                    icon: 'fa fa-random',
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
                // Hide the form before the notification
                $("#createContradictionDiv").hide();
                var successNotice = new PNotify({
                    type: 'success',
                    title: 'Success',
                    text: 'Contradiction successfully added.',
                    icon: 'fa fa-random',
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
        // Hide the form
        $("#createContradictionDiv").hide();
    },
    // Cancel save the edited contradiction
    'click #cancel-edit-save-contradiction-button': function(event, template) {
        event.preventDefault();
        $("#editContradictionDiv").hide();
    },
    // Cancel delete the contradiction
    'click #cancel-delete-contradiction-button': function(event, template) {
        event.preventDefault();
        $("#deleteContradictionDiv").hide();
    },
    // Close show the contradiction
    'click #close-contradiction-button': function(event, template) {
        event.preventDefault();
        $("#showContradictionDiv").hide();
    },
    // Delete the contradiction
    'click #delete-contradiction-button': function(event, template) {
        event.preventDefault();
        Meteor.call('deleteContradiction', Session.get('contradictionToDeleteData'), this.project._id, function(error, result) {
            if (error) {
                var errorNotice = new PNotify({
                    type: 'error',
                    title: 'Error',
                    text: 'There was an error in deleting the contradiction',
                    icon: 'fa fa-random',
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
                // Hide the buttons
                $("#deleteContradictionDiv").hide();
                var successNotice = new PNotify({
                    type: 'success',
                    title: 'Success',
                    text: 'Contradiction successfully deleted.',
                    icon: 'fa fa-random',
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

});

/*****************************************************************************/
/* ActivityContradictions: Helpers */
/*****************************************************************************/
Template.ActivityContradictions.helpers({
    activities: function() {
        // Return only the activities in the current project
        return Activities.find({ projectId: this.project._id }).fetch();
    },
    activityElements: function() {
        // Return only the activity elements in the current project
        return ActivityElements.find({ projectId: this.project._id }).fetch();
    },
    autocompleteSettingsNode: function() {
        return {
            position: "bottom",
            limit: 8,
            rules: [{
                    token: '',
                    subscription: 'autocompleteActivities',
                    collection: 'Activities',
                    //collection: "autocompleteActivityElements",
                    field: 'activityData.title',
                    template: Template.ActivityPill,
                    noMatchTemplate: Template.NotFoundPill
                },
            ]
        };
    },
    deleteContradictionData: function() {
        if (typeof Session.get('contradictionToDeleteData') !== "undefined") {
            return Session.get('contradictionToDeleteData');
        }
    },
    showContradictionData: function() {
        if (typeof Session.get('contradictionToShowData') !== "undefined") {
            return Contradictions.findOne({ _id: Session.get('contradictionToShowData') });
        }
    }
});

/*****************************************************************************/
/* ActivityContradictions: Lifecycle Hooks */
/*****************************************************************************/
Template.ActivityContradictions.onCreated(function() {
    Meteor.subscribe('projects');
    Meteor.subscribe('activities');
    Meteor.subscribe('activityElements');
    Meteor.subscribe('contradictions');
});

Template.ActivityContradictions.onRendered(function() {
    // Make the table responsive
    $("table.reactive-table").wrap("<div class='table table-responsive'></div>");
    // Hide the divs that enable the edit, view, delete and create of contradictions by default
    $("#showContradictionDiv").hide();
    $("#editContradictionDiv").hide();
    $("#createContradictionDiv").hide();
    $("#deleteContradictionDiv").hide();
    $("#discussContradictionDiv").hide();
    // Enable select2
    $('.select2-dropdown').select2({
        dropdownAutoWidth: true,
        width: '100%'
    });
});

Template.ActivityContradictions.onDestroyed(function() {});

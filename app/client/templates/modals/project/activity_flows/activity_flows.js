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
import { Flows } from '../../../../../lib/collections/flows.js';

// Client only collection for the autocomplete
LocalActivityElements = new Mongo.Collection(null);

/*****************************************************************************/
/* ActivityFlows: Event Handlers */
/*****************************************************************************/
Template.ActivityFlows.events({
    // Show the div that enable the creation of flows
    'click #create-flow-button': function(event, template) {
        event.preventDefault();
        $("#createFlowDiv").show();
    },
    // Save the flow and hide the form
    'click #create-save-flow-button': function(event, template) {
        event.preventDefault();
        // Get the data from the form
        var newTitle = $('#new-flow-title').val();
        var newDescription = $('#new-flow-description').val();
        var newResource = $('#new-flow-resource').val();
        var newType = $('#new-flow-type').val();
        var newWeight = parseInt($('#new-flow-weight').val());
        var newFirstNode = $('#new-flow-first-node option:selected').data('option');
        var newSecondNode = $('#new-flow-second-node option:selected').data('option');
        // Format data from the form as an object
        flowData = {
            "title": newTitle,
            "description": newDescription,
            "resource": newResource,
            "type": newType,
            "weight": newWeight,
            "firstNode": newFirstNode,
            "secondNode": newSecondNode
        }
        // Save the flow
        // Validate and save new data
        Meteor.call('addFlow', this.project._id, flowData, function(error, result) {
            if (error) {
                var errorNotice = new PNotify({
                    type: 'error',
                    title: 'Error',
                    text: 'There was an error in adding the flow',
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
                $("#createFlowDiv").hide();
                var successNotice = new PNotify({
                    type: 'success',
                    title: 'Success',
                    text: 'Flow successfully added.',
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
        $("#createFlowDiv").hide();
    },
    // Cancel save the new flow
    'click #cancel-create-save-flow-button': function(event, template) {
        event.preventDefault();
        $("#createFlowDiv").hide();
    },
    // Cancel save the edited flow
    'click #cancel-edit-save-flow-button': function(event, template) {
        event.preventDefault();
        $("#editFlowDiv").hide();
    },
    // Cancel delete the flow
    'click #cancel-delete-flow-button': function(event, template) {
        event.preventDefault();
        $("#deleteFlowDiv").hide();
    },
    // Close show the flow
    'click #close-flow-button': function(event, template) {
        event.preventDefault();
        $("#showFlowDiv").hide();
    },
    // Close discuss the flow
    'click #close-flow-discussion-button': function(event, template) {
        event.preventDefault();
        $("#discussFlowDiv").hide();
    },
    // Delete the flow
    'click #delete-flow-button': function(event, template) {
        event.preventDefault();
        Meteor.call('deleteFlow', Session.get('flowToDeleteData'), Flows.findOne({ _id: Session.get('flowToDeleteData') }).projectId, function(error, result) {
            if (error) {
                var errorNotice = new PNotify({
                    type: 'error',
                    title: 'Error',
                    text: 'There was an error in deleting the flow',
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
                $("#deleteFlowDiv").hide();
                var successNotice = new PNotify({
                    type: 'success',
                    title: 'Success',
                    text: 'Flow successfully deleted.',
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
/* ActivityFlows: Helpers */
/*****************************************************************************/
Template.ActivityFlows.helpers({
    activities: function() {
        // Return only the activities in the current project
        return Activities.find({ projectId: this.project._id }).fetch();
    },
    activityElements: function() {
        // Return only the activity elements in the current project
        return ActivityElements.find({ projectId: this.project._id }).fetch();
    },
    deleteFlowData: function() {
        if (typeof Session.get('flowToDeleteData') !== "undefined") {
            return Session.get('flowToDeleteData');
        }
    },
    showFlowData: function() {
        if (typeof Session.get('flowToShowData') !== "undefined") {
            // Get the flow data
            var thisData = Flows.findOne({ _id: Session.get('flowToShowData') });
            // If there is data... then return it
            if (thisData) {
                // Add the data for the nodes
                thisData.firstNodeData = Activities.findOne({ _id: thisData.flowData.firstNode });
                thisData.secondNodeData = Activities.findOne({ _id: thisData.flowData.secondNode });
                // Return the data
                return thisData;
            }
        }
    },
    thisUsername: function() {
        return Meteor.user().username;
    },
    thisName: function() {
        var name = Meteor.user().profile.firstName + ' ' + Meteor.user().profile.lastName;
        return name;
    },
    thisGravatar: function() {
        return Meteor.user().profile.avatar;
    },
    thisRoomId: function() {
        if (typeof Session.get('discussionToShow') !== "undefined") {
            return this.project._id + "-" + Session.get('discussionToShow');
        }
    }
});

/*****************************************************************************/
/* ActivityFlows: Lifecycle Hooks */
/*****************************************************************************/
Template.ActivityFlows.onCreated(function() {
    Meteor.subscribe('projects');
    Meteor.subscribe('activities');
    Meteor.subscribe('activityElements');
    Meteor.subscribe('flows');
});

Template.ActivityFlows.onRendered(function() {
    // Make the table responsive
    $("table.reactive-table").wrap("<div class='table table-responsive'></div>");
    // Hide the divs that enable the edit, view, delete and create of flows by default
    $("#showFlowDiv").hide();
    $("#editFlowDiv").hide();
    $("#createFlowDiv").hide();
    $("#deleteFlowDiv").hide();
    $("#discussFlowDiv").hide();
    // Enable select2
    $('.select2-dropdown').select2({
        dropdownAutoWidth: true,
        width: '100%'
    });
});

Template.ActivityFlows.onDestroyed(function() {});

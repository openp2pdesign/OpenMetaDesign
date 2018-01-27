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
        // Create a random id for the new flow
        newID = Random.id();
        // Get the data from the form
        var newTitle = $('#new-flow-title').val();
        var newDescription = $('#new-flow-description').val();
        var newResource = $('#new-flow-resource').val();
        var newType = $('#new-flow-type').val();
        var newWeight = parseInt($('#new-flow-weight').val());
        var newFirstNode = $('#new-flow-first-node').val();
        var newSecondNode = $('#new-flow-second-node').val();
        var newDirection = $('input[name=flow_direction]:checked').val();
        // Format data from the form as an object
        flowData = {
            "id": newID,
            "title": newTitle,
            "description": newDescription,
            "resource": newResource,
            "type": newType,
            "weight": newWeight,
            "firstNode": newFirstNode,
            "secondNode": newSecondNode,
            "direction": newDirection
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
                var successNotice = new PNotify({
                    type: 'success',
                    title: 'Success',
                    text: 'Flow successfully added.',
                    icon: 'fa fa-randoms',
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
    // Autocomplete of first node
    "autocompleteselect #new-flow-first-node": function(e, t, doc) {
        console.log("selected ", doc);
    }

});

/*****************************************************************************/
/* ActivityFlows: Helpers */
/*****************************************************************************/
Template.ActivityFlows.helpers({
    activities: function() {
        Meteor.subscribe('activities');
        return Activities.find({}).fetch();
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
    deleteFlowData: function() {
        return Session.get('flowToDeleteData');
    },
    showFlowData: function() {
        return Session.get('flowToShowData');
    },
    editFlowData: function() {
        return Session.get('flowToEditData');
    },
    reactiveTableFlowsSettings: function() {
        return {
            collection: this.project.flows,
            rowsPerPage: 5,
            useFontAwesome: true,
            showFilter: true,
            class: "table table-bordered table-hover",
            //noDataTmpl: ",,," // TODO Add template for an empty table
            fields: [{
                    key: 'id',
                    label: function() {
                        return new Spacebars.SafeString('<span><i class="fa fa-key" aria-hidden="true"></i> ID</span>');
                    },
                    sortable: false
                },
                {
                    key: 'title',
                    label: function() {
                        return new Spacebars.SafeString('<span><i class="fa fa-book" aria-hidden="true"></i> Title</span>');
                    },
                    sortable: false
                },
                {
                    label: function() {
                        return new Spacebars.SafeString('<span><i class="fa fa-tasks" aria-hidden="true"></i> Actions</span>');
                    },
                    tmpl: Template.FlowButtons,
                    sortable: false
                }
            ]
        };
    },
});

/*****************************************************************************/
/* ActivityFlows: Lifecycle Hooks */
/*****************************************************************************/
Template.ActivityFlows.onCreated(function() {});

Template.ActivityFlows.onRendered(function() {
    // Make the table responsive
    $("table.reactive-table").wrap("<div class='table table-responsive'></div>");
    // Hide the divs that enable the edit, view, delete and create of flows by default
    $("#showFlowDiv").hide();
    $("#editFlowDiv").hide();
    $("#createFlowDiv").hide();
    $("#deleteFlowDiv").hide();
    // Enable select2
    $('.select2-dropdown').select2({
        dropdownAutoWidth: true,
        width: '100%'
    });
});

Template.ActivityFlows.onDestroyed(function() {});

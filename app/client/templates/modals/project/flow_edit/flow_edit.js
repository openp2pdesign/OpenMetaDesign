// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";
// jquery
import { $ } from 'meteor/jquery';
// Load Projects and Settings
import { Projects } from '../../../../../lib/collections/projects.js';
import { Settings } from '../../../../../lib/collections/settings.js';
import { Activities } from '../../../../../lib/collections/activities.js';
import { Flows } from '../../../../../lib/collections/flows.js';

/*****************************************************************************/
/* FlowEdit: Event Handlers */
/*****************************************************************************/
Template.FlowEdit.events({
    // Edit the flow
    'click #edit-save-flow-button': function(event, template) {
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
        // Add a new flow
        if (thisMode == "add") {
            // Save the flow
            // Validate and save new data
            Meteor.call('addFlow', thisProjectID, flowData, function(error, result) {
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
                    // Close the modal, since there is no activity any longer
                    Modal.hide('Flow');
                    // Add notification
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
        } // Edit an existing flow
        else if (thisMode == "edit") {
            // Save the flow
            // Validate and save new data
            Meteor.call('updateFlow', thisProjectID, thisFlowID, flowData, function(error, result) {
                if (error) {
                    var errorNotice = new PNotify({
                        type: 'error',
                        title: 'Error',
                        text: 'There was an error in updating the flow',
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
                    // Add notification
                    var successNotice = new PNotify({
                        type: 'success',
                        title: 'Success',
                        text: 'Flow successfully updated.',
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
    },
    });

/*****************************************************************************/
/* FlowEdit: Helpers */
/*****************************************************************************/
Template.FlowEdit.helpers({
    data: function() {
        // Return helper values for the template
        var thisFlow = {}
        if (thisMode === "edit") {
            // Get the flow data
            var thisFlow = Flows.findOne({
                '_id': this.flowId
            });
            // If there is data... then return it
            if (thisFlow) {
                // Add the data for the nodes
                thisFlow.flowData.firstNodeData = Activities.findOne({
                    '_id': thisFlow.flowData.firstNode
                });
                thisFlow.flowData.secondNodeData = Activities.findOne({
                    '_id': thisFlow.flowData.secondNode
                });
            }
        } else if (thisMode === "add") {
            thisFlow.flowData = {
                "title": "Title of the flow...",
                "type": "information or digital resources",
                "description": "Description of the flow...",
                "resource": "The resource flowing...",
                "weight": 0,
            }
        }
        // Return the data
        return thisFlow.flowData;
    },
    activities: function() {
        // Return only the activities in the current project
        return Activities.find({
            'projectId': thisProjectID
        }).fetch();
    },
});


/*****************************************************************************/
/* FlowEdit: Lifecycle Hooks */
/*****************************************************************************/
Template.FlowEdit.onCreated(function () {
    Meteor.subscribe('projects');
    Meteor.subscribe('activities');
    Meteor.subscribe('flows');
    // Load variables
    thisProjectID = this.data.projectId
    thisFlowID = this.data.flowId;
    thisMode = this.data.mode;
});

Template.FlowEdit.onRendered(function () {
    // Icons for select2 options
    function optionFormatIcon(icon) {
        var originalOption = icon.element;
        return '<i class="' + $(originalOption).data('icon') + '"></i> ' + icon.text;
    }
    // Enable select2
    $('.select2-dropdown').select2({
        dropdownAutoWidth: true,
        width: '100%',
        templateSelection: optionFormatIcon,
        templateResult: optionFormatIcon,
        allowHtml: true,
        escapeMarkup: function(m) {
            return m;
        }
    });
});

Template.FlowEdit.onDestroyed(function () {
});

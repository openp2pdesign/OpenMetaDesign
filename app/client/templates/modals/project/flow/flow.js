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
/* Flow: Event Handlers */
/*****************************************************************************/
Template.Flow.events({
    // Delete the flow
    'click #delete-flow-button': function(event, template) {
        event.preventDefault();
        Meteor.call('deleteFlow', thisFlowID, thisProjectID, function(error, result) {
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
                // Close the modal, since there is no activity any longer
                Modal.hide('Flow');
                // Add notification
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
/* Flow: Helpers */
/*****************************************************************************/
Template.Flow.helpers({
    activities: function() {
        // Return only the activities in the current project
        return Activities.find({
            'projectId': this._id
        }).fetch();
    },
    data: function() {
        // Get the flow data
        var thisData = Flows.findOne({
            '_id': this.flowId
        });
        // If there is data... then return it
        if (thisData) {
            // Add the data for the nodes
            thisData.firstNodeData = Activities.findOne({
                '_id': thisData.flowData.firstNode
            });
            thisData.secondNodeData = Activities.findOne({
                '_id': thisData.flowData.secondNode
            });
            // Return the data
            return thisData;
        }
    },
    equals: function(a, b) {
        // Compare variables, for if section in Blaze template
        return a == b;
    },
    isEditMode: function() {
        if (this.mode == "edit") {
            return true;
        } else {
            return false;
        }
    }
});

/*****************************************************************************/
/* Flow: Lifecycle Hooks */
/*****************************************************************************/
Template.Flow.onCreated(function() {
    Meteor.subscribe('projects');
    Meteor.subscribe('activities');
    Meteor.subscribe('flows');
    // Load variables
    thisProjectID = this.data.projectId;
    if (this.data.mode === "edit") {
        thisFlowID = this.data.flowId;
        Session.set('discussionToShow', thisProjectID + "-" + thisFlowID);
    }
});

Template.Flow.onRendered(function() {
    // Add tooltip to the tabs
    $('[data-toggle="tab"]').tooltip({
        trigger: 'hover',
        placement: 'top'
    });
});

Template.Flow.onDestroyed(function() {});

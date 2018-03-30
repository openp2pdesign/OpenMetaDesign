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
import { Contradictions } from '../../../../../lib/collections/contradictions.js';

/*****************************************************************************/
/* Contradiction: Event Handlers */
/*****************************************************************************/
Template.Contradiction.events({
    // Delete the contradiction
    'click #delete-contradiction-button': function(event, template) {
        event.preventDefault();
        Meteor.call('deleteContradiction', thisContradictionID, thisProjectID, function(error, result) {
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
                // Close the modal, since there is no activity any longer
                Modal.hide('Contradiction');
                // Add notification
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
/* Contradiction: Helpers */
/*****************************************************************************/
Template.Contradiction.helpers({
    activities: function() {
        // Return only the activities in the current project
        return Activities.find({
            'projectId': this._id
        }).fetch();
    },
    data: function() {
        // Get the contradiction data
        var thisData = Contradictions.findOne({
            '_id': this.contradictionId
        });
        // If there is data... then return it
        if (thisData) {
            // Add the data for the nodes
            thisData.firstNodeData = Activities.findOne({
                '_id': thisData.contradictionData.firstNode
            });
            thisData.secondNodeData = Activities.findOne({
                '_id': thisData.contradictionData.secondNode
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
/* Contradiction: Lifecycle Hooks */
/*****************************************************************************/
Template.Contradiction.onCreated(function() {
    Meteor.subscribe('projects');
    Meteor.subscribe('activities');
    Meteor.subscribe('contradictions');
    // Load variables
    thisProjectID = this.data.projectId;
    if (this.data.mode === "edit") {
        thisContradictionID = this.data.contradictionId;
        Session.set('discussionToShow', thisProjectID + "-" + thisContradictionID);
    }
});

Template.Contradiction.onRendered(function() {
    // Add tooltip to the tabs
    $('[data-toggle="tab"]').tooltip({
        trigger: 'hover',
        placement: 'top'
    });
});

Template.Contradiction.onDestroyed(function() {});

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
import { ActivityElements } from '../../../../../lib/collections/activity_elements.js';
import { Contradictions } from '../../../../../lib/collections/contradictions.js';

/*****************************************************************************/
/* ContradictionEdit: Event Handlers */
/*****************************************************************************/
Template.ContradictionEdit.events({
    // Show the contradiction lvel in realtime
    'change select': function(event, template) {
        // Get the data from the form
        var newFirstNode = $('#new-contradiction-first-node option:selected').data('option');
        var newSecondNode = $('#new-contradiction-second-node option:selected').data('option');
        // Calculate the contradiction level
        if (typeof newFirstNode !== "undefined" && typeof newSecondNode !== "undefined") {
            Meteor.call('contradictionLevel', newFirstNode, newSecondNode, function(error, result) {
                if (error) {} else {
                    Session.set("contradictionLevel", result);
                    // Show contradiction type explanation div
                    $('#contradiction-type-explanation').show();
                }
            });
        }
    },
    // Edit the contradiction
    'click #edit-save-contradiction-button': function(event, template) {
        event.preventDefault();
        // Get the data from the form
        var newTitle = $('#new-contradiction-title').val();
        var newDescription = $('#new-contradiction-description').val();
        var newResource = $('#new-contradiction-resource').val();
        var newType = $('#new-contradiction-type').val();
        var newWeight = parseInt($('#new-contradiction-weight').val());
        var newFirstNode = $('#new-contradiction-first-node option:selected').data('option');
        var newSecondNode = $('#new-contradiction-second-node option:selected').data('option');
        var newLevel = 0;
        // Calculate the contradiction level
        Meteor.call('contradictionLevel', newFirstNode, newSecondNode, function(error, result) {
            if (error) {} else {
                newLevel = result;
            }
        });
        // Format data from the form as an object
        contradictionData = {
            "title": newTitle,
            "description": newDescription,
            "firstNode": newFirstNode,
            "secondNode": newSecondNode,
            "level": newLevel
        }
        // Add a new contradiction
        if (thisMode == "add") {
            // Save the contradiction
            // Validate and save new data
            Meteor.call('addContradiction', thisProjectID, contradictionData, function(error, result) {
                if (error) {
                    var errorNotice = new PNotify({
                        type: 'error',
                        title: 'Error',
                        text: 'There was an error in adding the contradiction',
                        icon: 'fa fa-exclamation-triangle',
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
                        text: 'Contradiction successfully added.',
                        icon: 'fa fa-exclamation-triangle',
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
        } // Edit an existing contradiction
        else if (thisMode == "edit") {
            // Save the contradiction
            // Validate and save new data
            Meteor.call('updateContradiction', thisProjectID, thisContradictionID, contradictionData, function(error, result) {
                if (error) {
                    var errorNotice = new PNotify({
                        type: 'error',
                        title: 'Error',
                        text: 'There was an error in updating the contradiction',
                        icon: 'fa fa-exclamation-triangle',
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
                    // Hide contradiction type explanation div
                    $('#contradiction-type-explanation').hide();
                    // Add notification
                    var successNotice = new PNotify({
                        type: 'success',
                        title: 'Success',
                        text: 'Contradiction successfully updated.',
                        icon: 'fa fa-exclamation-triangle',
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
/* ContradictionEdit: Helpers */
/*****************************************************************************/
Template.ContradictionEdit.helpers({
    data: function() {
        // Return helper values for the template
        var thisContradiction = {}
        if (thisMode === "edit") {
            // Get the contradiction data
            var thisContradiction = Contradictions.findOne({
                '_id': this.contradictionId
            });
            // If there is data... then return it
            if (thisContradiction) {
                // Add the data for the nodes
                thisContradiction.contradictionData.firstNodeData =
                ActivityElements.findOne({
                    '_id': thisContradiction.contradictionData.firstNode
                });
                thisContradiction.contradictionData.secondNodeData = ActivityElements.findOne({
                    '_id': thisContradiction.contradictionData.secondNode
                });
            }
        } else if (thisMode === "add") {
            thisContradiction.contradictionData = {
                "title": "Title of the contradiction...",
                "description": "Description of the contradiction...",
                "resource": "The resource contradictioning...",
                "weight": 0,
            }
            thisContradiction.contradictionData.firstNodeData =
            ActivityElements.findOne();
            thisContradiction.contradictionData.secondNodeData = ActivityElements.findOne();
        }
        // Return the data
        return thisContradiction.contradictionData;
    },
    activities: function() {
        // Return only the activities in the current project
        return Activities.find({
            'projectId': thisProjectID
        }).fetch();;
    },
    activityElements: function() {
        // Return only the activities elements in the current project
        return ActivityElements.find({
            'projectId': thisProjectID
        }).fetch();
    },
    contradictionLevel: function() {
        return Session.get('contradictionLevel');
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
/* ContradictionEdit: Lifecycle Hooks */
/*****************************************************************************/
Template.ContradictionEdit.onCreated(function () {
    Meteor.subscribe('projects');
    Meteor.subscribe('activities');
    Meteor.subscribe('activityelements');
    Meteor.subscribe('contradictions');
    // Load variables
    thisProjectID = this.data.projectId
    thisContradictionID = this.data.contradictionId;
    thisMode = this.data.mode;
});

Template.ContradictionEdit.onRendered(function () {
    // Hide contradiction type explanation div
    $('#contradiction-type-explanation').hide();
    // Icons for select2 options
    function optionFormatIcon(icon) {
        var originalOption = icon.element;
        return '<i class="' + $(originalOption).data('icon') + '"></i> ' + "#" + $(originalOption).data('activity-number') + ' - ' + '<i class="icomoon-' + $(originalOption).data('icon-element') + '-select2"></i> ' + '<span class="first-capital-letter">' + icon.text + '</span>';
    }
    // Enable select2
    $('.select2-dropdown').select2({
        dropdownAutoWidth: true,
        width: '100%',
        dropdownParent: $('#thisModal'),
        templateSelection: optionFormatIcon,
        templateResult: optionFormatIcon,
        allowHtml: true,
        escapeMarkup: function(m) {
            return m;
        }
    });
    //$("#new-contradiction-second-node").select2("data-option", '76KFiBacbPdyLAchr');
});

Template.ContradictionEdit.onDestroyed(function () {
});

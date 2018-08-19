// Import Moment
import { moment } from 'meteor/momentjs:moment';
// Diff
let diff = require('deep-diff');
// Import collections
import { Projects } from '../../../../lib/collections/projects.js';
import { Activities } from '../../../../lib/collections/activities.js';
import { ActivityElements } from '../../../../lib/collections/activity_elements.js';
import { Flows } from '../../../../lib/collections/flows.js';
import { Contradictions } from '../../../../lib/collections/contradictions.js';
import { Settings } from '../../../../lib/collections/settings.js';
/*****************************************************************************/
/* ProjectsViz: Event Handlers */
/*****************************************************************************/
Template.ProjectsViz.events({
    'click .html-edit-button': function(event) {
        event.preventDefault();
        // Check the data embedded in the button
        item = event.currentTarget.innerHTML;
        var itemData = $(item).find('[data-mode]')[0].outerHTML;
        var dataFieldMode = $(itemData).data("mode");
        var dataFieldID = $(itemData).data("id");
        if (dataFieldMode == "edit") {
            // Edit button
            Modal.show('EditHtml', function() {
                return {
                    "project": thisProject._id,
                    "field": dataFieldID,
                    "mode": "edit"
                }
            });
        } else if (dataFieldMode == "discuss") {
            // Set the session variable for the discussion
            Session.set('discussionToShow', thisProject._id + "-" + dataFieldID);
            // Discuss button
            Modal.show('DiscussHtml', function() {
                return {
                    "project": thisProject._id,
                    "field": dataFieldID,
                    "mode": "discuss"
                }
            });
        }
    },
    'click .activity-button': function(event) {
        event.preventDefault();
        // Check the data embedded in the button
        item = event.currentTarget.outerHTML;
        dataActivityMode = $(item).attr("data-activity-mode");
        dataProcessId = $(item).attr("data-process-id");
        dataActivityId = $(item).attr("data-activity-id");
        if (dataActivityMode == "edit") {
            // Edit button
            Modal.show('Activity', function() {
                return {
                    "project": thisProject._id,
                    "process": dataProcessId,
                    "activity": dataActivityId,
                    "mode": "edit"
                }
            });
        } else if (dataActivityMode == "add") {
            // Add button
            Modal.show('Activity', function() {
                return {
                    "project": thisProject._id,
                    "process": dataProcessId,
                    "activity": dataActivityId,
                    "mode": "add"
                }
            });
        }
    },
    'click .discuss-button': function(event) {
        event.preventDefault();
        Modal.show('ActivityDiscuss');
    },
    'click .flows-button': function(event) {
        event.preventDefault();
        Modal.show('ActivityFlows');
    },
    'click .issues-button': function(event) {
        event.preventDefault();
        Modal.show('ActivityIssues');
    },
    'click .delete-button': function(event) {
        event.preventDefault();
        // Check the data embedded in the button
        item = event.currentTarget.outerHTML;
        dataActivityId = $(item).attr("data-activity-id");
        // If there's an activity id, delete it
        if (dataActivityId) {
            Modal.show('ActivityDelete', function(event) {
                return {
                    "project": thisProject._id,
                    "activity": dataActivityId
                }
            });
        }
    },
    // Show the div that enable the edit of flows
    'click .edit-flow': function(event, template) {
        event.preventDefault();
        var thisFlow = Flows.findOne({
            '_id': event.currentTarget.id
        });
        // Launch modal
        Modal.show('Flow', function() {
            return {
                "projectId": this.projectId,
                "flowId": event.currentTarget.id,
                "mode": "edit"
            }
        });
    },
    // Show the div that enable the edit of contradictions
    'click .edit-contradiction': function(event, template) {
        event.preventDefault();
        var thisContradiction = Contradictions.findOne({
            '_id': event.currentTarget.id
        });
        // Launch modal
        Modal.show('Contradiction', function() {
            return {
                "projectId": this.projectId,
                "contradictionId": event.currentTarget.id,
                "mode": "edit"
            }
        });
    },
    'click ul.nav-tabs li a': function(event, template) {
        event.preventDefault();
        if (event.currentTarget.hash === "#view-project") {
            var view = Blaze.getView(document.getElementById("d3-container"));
            if (view.name === "Template.VizVisualization") {
                //Blaze.remove(view);
                Blaze.renderWithData(Template.VizVisualization, this, document.getElementById("d3-container"));
            }
        }
    },
});

/*****************************************************************************/
/* ProjectsViz: Helpers */
/*****************************************************************************/
Template.ProjectsViz.helpers({
    data: function() {
        return Projects.findOne({
            '_id': thisProject._id
        });
    },
    users: function() {
        return this.users;
    },
});
/*****************************************************************************/
/* ProjectsViz: Lifecycle Hooks */
/*****************************************************************************/
Template.ProjectsViz.onCreated(function() {
    // Access this specific project
    self.subscription = Meteor.subscribe('projects');
    thisProject = this.data;
    // Access activity elements for contradictions viz
    Meteor.subscribe('activityelements');
});

Template.ProjectsViz.onRendered(function() {
    // Add tooltip to the tabs
    $('[data-toggle="tab"]').tooltip({
        trigger: 'hover',
        placement: 'top'
    });
});

Template.ProjectsViz.onDestroyed(function() {});

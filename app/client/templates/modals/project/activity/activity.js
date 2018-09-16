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

/*****************************************************************************/
/* Activity: Event Handlers */
/*****************************************************************************/
Template.Activity.events({
    'click #discuss-tab-li': function(event, template) {
        event.preventDefault();
        // Set the discussion session
        Session.set('discussionToShow', thisProject._id + "-" + thisActivity.id);
    },
});

/*****************************************************************************/
/* Activity: Helpers */
/*****************************************************************************/
Template.Activity.helpers({
    data: function() {
        // Return helper values for the template
        return {
            "project": thisProject,
            "process": thisProcess,
            "activity": thisActivity,
            "mode": this.mode
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
/* Activity: Lifecycle Hooks */
/*****************************************************************************/
Template.Activity.onCreated(function() {
    // Access projects
    self.subscription = Meteor.subscribe('projects');
    // Load variables
    thisProjectID = this.data.project;
    if (this.data.process === "none") {
        thisProcessID = _.find(thisProject.processes, function(item) {
            return item.title == "Customer activities";
        });
        thisProcessID = thisProcessID.id;
    } else {
        thisProcessID = this.data.process;
    }
    thisActivityID = this.data.activity;
    Session.set('thisProject', thisProjectID);
    Session.set('thisActivity', thisActivityID);
    Session.set('discussionToShow', thisProjectID + "-" + thisActivityID);
    // Load the current project
    thisProject = Projects.findOne({
        '_id': thisProjectID
    });
    // Load the current process
    thisProcess = _.find(thisProject.processes, function(item) {
        return item.id == thisProcessID;
    });
    // Load the activity
    if (this.data.mode == "edit") {
        // Edit mode
        // Load the current activity
        thisActivity = _.find(thisProcess.activities, function(item) {
            return item.id == thisActivityID;
        });
    } else {
        // Add mode
        // Load a default empty activity
        thisActivity = {
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
    }

});

Template.Activity.onRendered(function() {
    // Enable tooltips in the tabs
    $('[data-toggle="tab"]').tooltip({
        trigger: 'hover',
        placement: 'top',
        animate: true,
        delay: 500,
        container: 'body'
    });
});

Template.Activity.onDestroyed(function() {});

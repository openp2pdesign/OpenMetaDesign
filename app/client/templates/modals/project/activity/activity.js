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
Template.Activity.events({});

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
});

/*****************************************************************************/
/* Activity: Lifecycle Hooks */
/*****************************************************************************/
Template.Activity.onCreated(function() {
    // Access projects
    self.subscription = Meteor.subscribe('projects');
    // Load variables
    thisProjectID = this.data.project;
    thisProcessID = this.data.process;
    thisActivityID = this.data.activity;
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

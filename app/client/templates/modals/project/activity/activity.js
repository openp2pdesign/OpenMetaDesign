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
});

/*****************************************************************************/
/* Activity: Helpers */
/*****************************************************************************/
Template.Activity.helpers({
    data: function() {
        // Return helper values for the template
        return {
            "project": thisProject,
            "process": this.process,
            "activity": defaultActivity
        }
    }

});

/*****************************************************************************/
/* Activity: Lifecycle Hooks */
/*****************************************************************************/
Template.Activity.onCreated(function() {
    // Access projects
    self.subscription = Meteor.subscribe('projects');
    // Load the current project
    var thisProject = Projects.findOne({
        '_id': this.project
    });
    // Default empty activity
    defaultActivity = {
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
});

Template.Activity.onRendered(function() {
    $('.activity').tooltip();
    $('[data-toggle="tab"]').tooltip({
    trigger: 'hover',
    placement: 'top',
    animate: true,
    delay: 500,
    container: 'body'
});
});

Template.Activity.onDestroyed(function() {});

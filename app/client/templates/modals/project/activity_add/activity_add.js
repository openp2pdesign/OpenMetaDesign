/*****************************************************************************/
/* ActivityAdd: Event Handlers */
/*****************************************************************************/

// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";

// Random id
import { Random } from 'meteor/random';
// Load Projects and Settings
import { Projects } from '../../../../../lib/collections/projects.js';
import { Settings } from '../../../../../lib/collections/settings.js';

Template.ActivityAdd.events({
    'click #confirm': function(event) {
        event.preventDefault();

        console.log(this);

        var thisActivityId = Random.id();
        var newTitle = $('#new-title').val();
        var newDescription = $('#new-description').val();
        // var newLastName = $('#new-lastname').val();
        // var newEmail = $('#new-email').val();
        // var newBio = $('#new-bio').val();

        // Validate and save new data

        Meteor.call('addActivity', projectId, processId, thisActivityId, activityData);

        var successNotice = new PNotify({
            type: 'success',
            title: 'Success',
            text: 'Activity successfully added.',
            icon: 'fa fa-user',
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

/*****************************************************************************/
/* ActivityAdd: Helpers */
/*****************************************************************************/
Template.ActivityAdd.helpers({
    data: function() {
        // Access projects
        self.subscription = Meteor.subscribe('projects');
        var thisProject = Projects.findOne({
            '_id': this.id
        });
        console.log("help", this);
        return {
            "project": thisProject,
            "process": this.process
        }
    }

});

/*****************************************************************************/
/* ActivityAdd: Lifecycle Hooks */
/*****************************************************************************/
Template.ActivityAdd.onCreated(function() {});

Template.ActivityAdd.onRendered(function() {});

Template.ActivityAdd.onDestroyed(function() {});

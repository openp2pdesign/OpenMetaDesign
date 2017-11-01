// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";
// jquery
import {
    $
} from 'meteor/jquery';
// Random id
import {
    Random
} from 'meteor/random';
// Load Projects and Settings
import { 
    Projects
} from '../../../../../lib/collections/projects.js';
import { 
    Settings
} from '../../../../../lib/collections/settings.js';

/*****************************************************************************/
/* EditHtml: Event Handlers */
/*****************************************************************************/
Template.EditHtml.events({
    'click #confirm': function(event) {
        event.preventDefault();

        var field = $('#new-field').attr("data-field");
        var fieldData = $('#new-field').val();

        // Validate and save new data
        Meteor.call('editProjectField', this.project, field, fieldData, function(error, result) {
            if (error) {
                var errorNotice = new PNotify({
                    type: 'error',
                    title: 'Error',
                    text: 'There was an error in editing the project.',
                    icon: 'fa fa-cubes',
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
                    text: 'Project successfully edited.',
                    icon: 'fa fa-cubes',
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
/* EditHtml: Helpers */
/*****************************************************************************/
Template.EditHtml.helpers({
    data: function() {
        // Return helper values for the template
        return {
            "project": thisProject,
            "id": this.field,
            "field": thisProject[this.field]
        }
    }
});

/*****************************************************************************/
/* EditHtml: Lifecycle Hooks */
/*****************************************************************************/
Template.EditHtml.onCreated(function() {
    // Access projects
    self.subscription = Meteor.subscribe('projects');
    // Load the current project
    var thisProject = Projects.findOne({
        '_id': this.project
    });
});

Template.EditHtml.onRendered(function() {});

Template.EditHtml.onDestroyed(function() {});

/*****************************************************************************/
/* ProjectsList: Event Handlers */
/*****************************************************************************/
Template.ProjectsList.events({
    'click .create-project': function(event, template) {
        event.preventDefault();
        Meteor.call('createProject', function(error, result) {
            Router.go('projectsViz', {
                _id: result
            });
        });
    }
});

/*****************************************************************************/
/* ProjectsList: Helpers */
/*****************************************************************************/
Template.ProjectsList.helpers({
    projects: function() {
        return Projects.find();
    },
});

/*****************************************************************************/
/* ProjectsList: Lifecycle Hooks */
/*****************************************************************************/
Template.ProjectsList.onCreated(function() {});

Template.ProjectsList.onRendered(function() {});

Template.ProjectsList.onDestroyed(function() {});

// Setup of tabular for this template
import {
    $
} from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
dataTablesBootstrap(window, $);

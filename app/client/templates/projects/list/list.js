// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";

// Import collection
import { InvitedUsersToProjects } from '../../../../lib/collections/invited_users_to_projects.js';

/*****************************************************************************/
/* ProjectsList: Event Handlers */
/*****************************************************************************/
Template.ProjectsList.events({
    'click #create-project-button': function(event, template) {
        event.preventDefault();
        Meteor.call('createProject', function(error, result) {
            if (error) {
                var errorNotice = new PNotify({
                    type: 'error',
                    title: 'Error',
                    text: 'There was an error in creating the project',
                    icon: 'fa fa-cube',
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
                Router.go('projectsViz', {
                    _id: result
                });
                var successNotice = new PNotify({
                    type: 'success',
                    title: 'Success',
                    text: 'Project successfully created.',
                    icon: 'fa fa-cube',
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
/* ProjectsList: Helpers */
/*****************************************************************************/
Template.ProjectsList.helpers({
    projects: function() {
        return Projects.find();
    },
    myProjectsSelector: function() {
        return {
            'users': {
                '$elemMatch': {
                    'id': Meteor.userId()
                }
            }
        };
    },
    myInvitationsToProjectsSelector: function() {
        if (Meteor.subscribe("invitedUsersToProjects").ready()) {
            var invitationsThisUser = InvitedUsersToProjects.find({
                'users.userId': Meteor.userId()
            }).fetch();
            var projectsIDs = [];
            for (x in invitationsThisUser) {
                projectsIDs.push(invitationsThisUser[x].projectId);
            }
            return {
                '_id': {
                    '$in': projectsIDs
                }
            };
        }
    },
});

/*****************************************************************************/
/* ProjectsList: Lifecycle Hooks */
/*****************************************************************************/
Template.ProjectsList.onCreated(function() {});

Template.ProjectsList.onRendered(function() {});

Template.ProjectsList.onDestroyed(function() {});

// Setup of tabular for this template
import { $ } from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
dataTablesBootstrap(window, $);

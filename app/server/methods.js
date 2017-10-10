/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

import { Projects } from '../lib/collections/projects.js';
import { Settings } from '../lib/collections/settings.js';

Meteor.methods({
    'removeAdmin': function(userId) {
        Roles.removeUsersFromRoles(userId, 'admin');
    },
    'addAdmin': function(userId) {
        Roles.addUsersToRoles(userId, 'admin');
    },
    'removeUser': function(userId) {
        Meteor.users.remove({
            _id: userId
        });
    },
    'updateUserFirstName': function(userId, newFirstName) {
        Meteor.users.update({
            _id: userId
        }, {
            $set: {
                "profile.firstName": newFirstName
            }
        });
    },
    'updateUserLastName': function(userId, newLasttName) {
        Meteor.users.update({
            _id: userId
        }, {
            $set: {
                "profile.lastName": newLastName
            }
        });
    },
    'updateUserBio': function(userId, newBio) {
        Meteor.users.update({
            _id: userId
        }, {
            $set: {
                "profile.bio": newBio
            }
        });
    },
    'updateUserEmail': function(userId, newEmail) {
        Meteor.users.update({
            _id: userId
        }, {
            $set: {
                "emails.0.address": newEmail
            }
        });
    },
    'updateGoogleMapsSettings': function(object, newkey) {
        Settings.update(object, {
            $set: {
                GoogleMapsAPIkey: newkey
            }
        });
    },
    'createProject': function() {
        console.log("method: createProject:")
        return Projects.insert({
            "title": "Title...",
            "description": "Description...",
            "version": "0.1",
            "processes": [{
                "title": "Customer processes",
                "activities": [{
                    "title": "Activity 01",
                    "description": "...",
                    "subject": "...",
                    "object": "...",
                    "outcome": "...",
                    "tools": "...",
                    "rules": "...",
                    "roles": "...",
                    "community": "...",
                    "time": {
                        "start": new Date(),
                        "end": new Date()
                    },
                    "participation": "Full control"
                }]
            }, {
                "title": "Front-Office processes"
            }, {
                "title": "Back-Office processes"
            }, {
                "title": "Support processes"
            }]
        });
    },
    'removeProject': function(projectId) {
        Projects.remove({
            _id: projectId
        });
    },
    'addActivity': function(projectId, processId, activityId, activityData) {
        Projects.update({
            _id: projectId
        }, {
            $push: {
                "processes.processId": activityData
            }
        });
    },
    'updateActivity': function(projectId, processId, activityId, activityData) {
        Projects.remove({
            _id: projectId
        });
    },
    'deleteActivity': function(projectId, processId, activityId) {
        Projects.remove({
            _id: projectId
        });
    },
    'addFlow': function(projectId, flowId, flowData) {
        Projects.remove({
            _id: projectId
        });
    },
    'updateFlow': function(projectId, flowId, flowData) {
        Projects.remove({
            _id: projectId
        });
    },
    'deleteFlow': function(projectId, flowId, flowData) {
        Projects.remove({
            _id: projectId
        });
    },
    'addContradiction': function(projectId, contradictionId, contradictionData) {
        Projects.remove({
            _id: projectId
        });
    },
    'updateContradiction': function(projectId, contradictionId, contradictionData) {
        Projects.remove({
            _id: projectId
        });
    },
    'deleteContradiction': function(projectId, contradictionId, contradictionData) {
        Projects.remove({
            _id: projectId
        });
    },
});

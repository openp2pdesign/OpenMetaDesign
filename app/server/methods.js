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
        return Projects.insert({
            "title": "Title...",
            "description": "Description...",
            "version": "0.1",
            "processes": [{
                "title": "Customer processes",
                "activities": []
            }, {
                "title": "Front-Office processes",
                "activities": []
            }, {
                "title": "Back-Office processes",
                "activities": []
            }, {
                "title": "Support processes",
                "activities": []
            }],
            "separators": [{
                "first": "#ID of left process",
                "second": "#ID of right process",
                "text": "Line of interaction"
            }, {
                "first": "#ID of left process",
                "second": "#ID of right process",
                "text": "Line of external visibility"
            }, {
                "first": "#ID of left process",
                "second": "#ID of right process",
                "text": "Line of ..."
            },]
        });
    },
    'removeProject': function(projectId) {
        Projects.remove({
            _id: projectId
        });
    },
    'addActivity': function(projectId, processId, activityId, activityData) {
        Projects.update({
            '_id': projectId,
            'processes.id': processId
        }, {
            $push: {
                'processes.$.activities': activityData
            }
        }, function (error) {
            if (error) {
            throwError("Error", error.reason, "while adding", activityId, "to process", processId, "of project", projectId, ".");
            return "error";
        } else {
            console.log("Activity", activityId, "added to process", processId, "of project", projectId, "successfully.");
            return "success";
        }});
    },
    'editActivity': function(projectId, processId, activityId, activityData) {
        Projects.update({
            '_id': projectId,
            'processes.id': processId
        }, {
            $set: {
                'processes.$.activities': activityData
            }
        }, function (error) {
            if (error) {
            throwError("Error", error.reason, "while adding", activityId, "to process", processId, "of project", projectId, ".");
            return "error";
        } else {
            console.log("Activity", activityId, "added to process", processId, "of project", projectId, "successfully.");
            return "success";
        }});
    },
    'deleteActivity': function(projectId, processId, activityId) {
        Projects.update({
            '_id': projectId,
            'processes.id': processId
        }, {
            $pull: {
                'processes.$.activities': { id: activityId}
            }
        }, function (error) {
            if (error) {
            throwError("Error", error.reason, "while adding", activityId, "to process", processId, "of project", projectId, ".");
            return "error";
        } else {
            console.log("Activity", activityId, "added to process", processId, "of project", projectId, "successfully.");
            return "success";
        }});
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

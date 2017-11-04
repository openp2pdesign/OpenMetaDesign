/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

import {
    Projects
} from '../lib/collections/projects.js';
import {
    Settings
} from '../lib/collections/settings.js';
let diff = require('deep-diff');

Meteor.methods({
    'checkDiff': function(newVersion, oldVersion) {
        var differences = diff(newVersion, oldVersion);
        for (diff in differences) {
            if (differences[diff].path != "updatedAt") {
                elementsChanged = differences[diff].path;
                itemsChanged = differences[diff].item.lhs;
                if (differences[diff].kind === "A") {
                    // ADD
                    // An activity was added
                    if (elementsChanged[0] === "processes" && elementsChanged[2] === "activities") {}
                    // An issue was added
                    if (elementsChanged[0] === "processes" && elementsChanged[2] === "issues") {}
                    // A flow was added
                    if (elementsChanged[0] === "processes" && elementsChanged[2] === "flows") {}
                } else if (differences[diff].kind === "E") {
                    // EDIT
                    for (element in elementsChanged) {
                        // The updatedAt field is always edited, so let's skip it
                        if (element != "updatedAt") {
                            console.log(elementsChanged);
                            // Get the changed element, delete it and recreate it with new data
                            // itemsChanged.id

                            // An element in the html fields was edited

                            // An activity was edited
                            if (elementsChanged[0] === "processes" && elementsChanged[2] === "activities") {}
                            // An issue was edited
                            if (elementsChanged[0] === "processes" && elementsChanged[2] === "issues") {}
                            // A flow was edited
                            if (elementsChanged[0] === "processes" && elementsChanged[2] === "flows") {}
                        }
                    }
                } else if (differences[diff].kind === "D") {
                    console.log(elementsChanged);
                    // DELETE
                    // Get the selected element, delete it
                    // itemsChanged.id

                    // An activity was deleted
                    if (elementsChanged[0] === "processes" && elementsChanged[2] === "activities") {}
                    // An issue was deleted
                    if (elementsChanged[0] === "processes" && elementsChanged[2] === "issues") {}
                    // A flow was deleted
                    if (elementsChanged[0] === "processes" && elementsChanged[2] === "flows") {}
                }
            }
        }
    },
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
                "first": "Customer processes",
                "second": "Front-Office processes",
                "text": "Line of interaction"
            }, {
                "first": "Front-Office processes",
                "second": "Back-Office processes",
                "text": "Line of external visibility"
            }, {
                "first": "Back-Office processes",
                "second": "Support processes",
                "text": "Line of ..."
            }, ]
        });
    },
    'removeProject': function(projectId) {
        Projects.remove({
            _id: projectId
        });
    },
    'editProjectField': function(projectId, field, fieldData) {
        var fields = {};
        fields[field] = fieldData;
        Projects.update({
            '_id': projectId
        }, {
            $set: fields
        }, function(error) {
            if (error) {
                throwError("Error", error.reason, "while editing the", field, "in project", projectId, ".");
                return "error";
            } else {
                console.log(field, "field added to project", projectId, "successfully.");
                return "success";
            }
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
        }, function(error) {
            if (error) {
                throwError("Error", error.reason, "while adding", activityId, "to process", processId, "of project", projectId, ".");
                return "error";
            } else {
                console.log("Activity", activityId, "added to process", processId, "of project", projectId, "successfully.");
                return "success";
            }
        });
    },
    'editActivity': function(projectId, processId, activityId, activityData) {
        Projects.update({
            '_id': projectId,
            'processes.id': processId
        }, {
            $set: {
                'processes.$.activities': activityData
            }
        }, function(error) {
            if (error) {
                throwError("Error", error.reason, "while adding", activityId, "to process", processId, "of project", projectId, ".");
                return "error";
            } else {
                console.log("Activity", activityId, "added to process", processId, "of project", projectId, "successfully.");
                return "success";
            }
        });
    },
    'deleteActivity': function(projectId, processId, activityId) {
        Projects.update({
            '_id': projectId,
            'processes.id': processId
        }, {
            $pull: {
                'processes.$.activities': {
                    id: activityId
                }
            }
        }, function(error) {
            if (error) {
                throwError("Error", error.reason, "while adding", activityId, "to process", processId, "of project", projectId, ".");
                return "error";
            } else {
                console.log("Activity", activityId, "added to process", processId, "of project", projectId, "successfully.");
                return "success";
            }
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

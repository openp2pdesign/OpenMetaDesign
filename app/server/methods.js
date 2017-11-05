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
        return differences;
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
            "release": "0.1",
            "community": "Describe the community that will be affected by this project or for which this project is developed for.",
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
            }],
            "versions": [{
                "number": 1,
                "diff": "First version"
            }]
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
        //fields.versionsCount
        //fields.versions.push()
        var thisProject = Projects.findOne({
            _id: projectId
        });
        // TODO Check diff between new and old version
        Projects.update({
            '_id': projectId
        }, {
            $set: fields
        }, function(error) {
            if (error) {
                throwError("Error", error.reason, "while editing the", field, "field in project", projectId, ".");
                return "error";
            } else {
                console.log("Field", field, "edited in project", projectId, "successfully.");
                return "success";
            }
        });
        Projects.update({
                '_id': projectId
            }, {
                $push: {
                    "versions": {
                        "number": thisProject.versionsCount + 1,
                        "diff": "diff"
                    }
                }
            },
            function(error) {
                if (error) {
                    throwError("Error", error.reason, "while editing the", field, "field in project", projectId, ".");
                    return "error";
                } else {
                    console.log("Field", field, "edited in project", projectId, "successfully.");
                    return "success";
                }
            });

    },
    'addActivity': function(projectId, processId, activityId, activityData) {
        // TODO Check diff between new and old version
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
        // TODO Check diff between new and old version
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
        // TODO Check diff between new and old version
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
        // TODO Check diff between new and old version
        Projects.remove({
            _id: projectId
        });
    },
    'updateFlow': function(projectId, flowId, flowData) {
        // TODO Check diff between new and old version
        Projects.remove({
            _id: projectId
        });
    },
    'deleteFlow': function(projectId, flowId, flowData) {
        // TODO Check diff between new and old version
        Projects.remove({
            _id: projectId
        });
    },
    'addContradiction': function(projectId, contradictionId, contradictionData) {
        // TODO Check diff between new and old version
        Projects.remove({
            _id: projectId
        });
    },
    'updateContradiction': function(projectId, contradictionId, contradictionData) {
        // TODO Check diff between new and old version
        Projects.remove({
            _id: projectId
        });
    },
    'deleteContradiction': function(projectId, contradictionId, contradictionData) {
        // TODO Check diff between new and old version
        Projects.remove({
            _id: projectId
        });
    },
});

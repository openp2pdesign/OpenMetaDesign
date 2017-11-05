/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

import { Projects } from '../lib/collections/projects.js';
import { Settings } from '../lib/collections/settings.js';
let diff = require('deep-diff');

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
        // Default empty project, without version diff
        var newProject = {
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
        }
        // Get the first version diff
        var differences = diff({}, newProject);
        // Store it as a string
        newProject.versions[0].diff = JSON.stringify(differences);
        // Get back the value with: JSON.parse()
        // Save the the first version of the project
        return Projects.insert(newProject);
    },
    'removeProject': function(projectId) {
        Projects.remove({
            _id: projectId
        });
    },
    'editProjectField': function(projectId, field, fieldData) {
        // Load the Project
        var thisProject = Projects.findOne({
            _id: projectId
        });
        oldVersion = thisProject;
        // Set up the changes to be implemented
        var fields = {};
        fields[field] = fieldData;
        // Apply changes by updating the Project
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
                // Save the version of the changes in the Project
                var newVersion = Projects.findOne({
                    _id: projectId
                });
                var differences = diff(oldVersion, newVersion);
                Projects.update({
                        '_id': projectId
                    }, {
                        $push: {
                            "versions": {
                                "number": thisProject.versionsCount + 1,
                                "diff": JSON.stringify(differences)
                            }
                        }
                });
                return "success";
            }
        });
    },
    'addActivity': function(projectId, processId, activityId, activityData) {
        // Load the Project
        var thisProject = Projects.findOne({
            _id: projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
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
                // Save the version of the changes in the Project
                var newVersion = Projects.findOne({
                    _id: projectId
                });
                var differences = diff(oldVersion, newVersion);
                Projects.update({
                        '_id': projectId
                    }, {
                        $push: {
                            "versions": {
                                "number": thisProject.versionsCount + 1,
                                "diff": JSON.stringify(differences)
                            }
                        }
                });
                return "success";
            }
        });
    },
    'editActivity': function(projectId, processId, activityId, activityData) {
        // Load the Project
        var thisProject = Projects.findOne({
            _id: projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
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
                // Save the version of the changes in the Project
                var newVersion = Projects.findOne({
                    _id: projectId
                });
                var differences = diff(oldVersion, newVersion);
                Projects.update({
                        '_id': projectId
                    }, {
                        $push: {
                            "versions": {
                                "number": thisProject.versionsCount + 1,
                                "diff": JSON.stringify(differences)
                            }
                        }
                });
                return "success";
            }
        });
    },
    'deleteActivity': function(projectId, processId, activityId) {
        // Load the Project
        var thisProject = Projects.findOne({
            _id: projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
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
                // Save the version of the changes in the Project
                var newVersion = Projects.findOne({
                    _id: projectId
                });
                var differences = diff(oldVersion, newVersion);
                Projects.update({
                        '_id': projectId
                    }, {
                        $push: {
                            "versions": {
                                "number": thisProject.versionsCount + 1,
                                "diff": JSON.stringify(differences)
                            }
                        }
                });
                return "success";
            }
        });
    },
    'addFlow': function(projectId, flowId, flowData) {
        // Load the Project
        var thisProject = Projects.findOne({
            _id: projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
        Projects.remove({
            _id: projectId
        });
    },
    'updateFlow': function(projectId, flowId, flowData) {
        // Load the Project
        var thisProject = Projects.findOne({
            _id: projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
        Projects.remove({
            _id: projectId
        });
    },
    'deleteFlow': function(projectId, flowId, flowData) {
        // Load the Project
        var thisProject = Projects.findOne({
            _id: projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
        Projects.remove({
            _id: projectId
        });
    },
    'addContradiction': function(projectId, contradictionId, contradictionData) {
        // Load the Project
        var thisProject = Projects.findOne({
            _id: projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
        Projects.remove({
            _id: projectId
        });
    },
    'updateContradiction': function(projectId, contradictionId, contradictionData) {
        // Load the Project
        var thisProject = Projects.findOne({
            _id: projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
        Projects.remove({
            _id: projectId
        });
    },
    'deleteContradiction': function(projectId, contradictionId, contradictionData) {
        // Load the Project
        var thisProject = Projects.findOne({
            _id: projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
        Projects.remove({
            _id: projectId
        });
    },
});

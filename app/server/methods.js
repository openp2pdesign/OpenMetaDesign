/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

import { Projects } from '../lib/collections/projects.js';
import { Activities } from '../lib/collections/activities.js';
import { ActivityElements } from '../lib/collections/activity_elements.js';
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
            "license": {"title": "CC-BY", "url": "https://creativecommons.org/licenses/by/4.0/"},
            "description": "Description...",
            "release": "0.1",
            "community": "Describe the community that will be affected by this project or for which this project is developed for.",
            "designers": "Describe the designers participate in this project.",
            "processes": [{
                "title": "Customer processes",
                "activities": [],
                "flows": [],
                "contradictions": []
            }, {
                "title": "Front-Office processes",
                "activities": [],
                "flows": [],
                "contradictions": []
            }, {
                "title": "Back-Office processes",
                "activities": [],
                "flows": [],
                "contradictions": []
            }, {
                "title": "Support processes",
                "activities": [],
                "flows": [],
                "contradictions": []
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
        projectId = Projects.insert(newProject);
        console.log("Project created with id", projectId, "successfully.");
        return projectId;
    },
    'removeProject': function(projectId) {
        Projects.remove({
            _id: projectId
        });
        // TODO Remove all activities and activityelements associated
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
                throw new Meteor.Error("method_error", "Error", error.reason, "while editing the", field, "field in project", projectId, ".");
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
        // Add activity number
        activityData.number = thisProject.activitiesCount + 1;
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
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while adding", activityId, "to process", processId, "of project", projectId, ".");
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
        // Update activities count
        Projects.update({
            '_id': projectId
        }, {
            $set: {
                'activitiesCount': activityData.number
            }
        });
        // Add data to activities collection
        Activities.insert({
            activityId: activityId,
            processId: processId,
            projectId: projectId,
            activityData: activityData
        });
        // TODO Add data to activity elements collection
        // TODO cycle for all the elements
        // ActivityElements.insert({
        //     activityElementId: {
        //         type: String,
        //     },
        //     activityId: activityId,
        //     processId: processId,
        //     projectId: projectId,
        //     activityElementData: {
        //         type: ActivityElementSchema
        //     }
        // });
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
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while editing", activityId, "to process", processId, "of project", projectId, ".");
                return "error";
            } else {
                console.log("Activity", activityId, "edited in process", processId, "of project", projectId, "successfully.");
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
                // TODO Update activities collection
                // TODO Update activity elements collection
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
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while deleting", activityId, "to process", processId, "of project", projectId, ".");
                return "error";
            } else {
                console.log("Activity", activityId, "deleted from process", processId, "of project", projectId, "successfully.");
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
                // TODO Delete related activities in collection
                // TODO Delete related activity elements in collection
                return "success";
            }
        });
    },
    'addFlow': function(projectId, flowData) {
        // Load the Project
        var thisProject = Projects.findOne({
            _id: projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
        Projects.update({
                '_id': projectId
            }, {
                $push: {
                    "flows": flowData
                }
        }, function(error) {
            if (error) {
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while adding", flowData.id, "to project", projectId, ".");
                return "error";
            } else {
                console.log("Flow", flowData.id, "added to prooject", projectId, "successfully.");
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
    'updateFlow': function(projectId, flowId, flowData) {
        // Load the Project
        var thisProject = Projects.findOne({
            _id: projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
        // ...
    },
    'deleteFlow': function(projectId, flowId, flowData) {
        // Load the Project
        var thisProject = Projects.findOne({
            _id: projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
        // ...
    },
    'addContradiction': function(projectId, contradictionData) {
        // Load the Project
        var thisProject = Projects.findOne({
            _id: projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
        // ...
    },
    'updateContradiction': function(projectId, contradictionId, contradictionData) {
        // Load the Project
        var thisProject = Projects.findOne({
            _id: projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
        // ...
    },
    'deleteContradiction': function(projectId, contradictionId, contradictionData) {
        // Load the Project
        var thisProject = Projects.findOne({
            _id: projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
        // ...
    },
});

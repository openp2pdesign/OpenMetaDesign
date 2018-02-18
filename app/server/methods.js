/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

import { Projects } from '../lib/collections/projects.js';
import { Activities } from '../lib/collections/activities.js';
import { ActivityElements } from '../lib/collections/activity_elements.js';
import { Settings } from '../lib/collections/settings.js';
import { Flows } from '../lib/collections/flows.js';
import { Contradictions } from '../lib/collections/activities.js';

let diff = require('deep-diff');

Meteor.methods({
    'deleteAdmin': function(userId) {
        Roles.removeUsersFromRoles(userId, 'admin');
    },
    'addAdmin': function(userId) {
        Roles.addUsersToRoles(userId, 'admin');
    },
    'deleteUser': function(userId) {
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
            "license": {
                "title": "CC-BY",
                "url": "https://creativecommons.org/licenses/by/4.0/"
            },
            "description": "Description...",
            "release": "0.1",
            "community": "Describe the community that will be affected by this project or for which this project is developed for.",
            "designers": "Describe the designers participate in this project.",
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
            "flows": [],
            "contradictions": [],
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
    'deleteProject': function(projectId) {
        // First check if it exists...
        let projectFoundId = Projects.findOne({_id: projectId});
        if (projectFoundId) {
            Projects.remove({
                _id: projectId
            });
            Activities.remove({
                "projectId": projectId
            });
            ActivityElements.remove({
                "projectId": projectId
            });
            Flows.remove({
                "projectId": projectId
            });
            // TODO: add after implementing contradictions
            // Contradictions.remove({
            //     "projectId": projectId
            // });
        } else {
            console.log("Cannot found project with ID", projectId);
        }
    },
    'editProjectField': function(projectId, field, fieldData) {
        // Load the Project
        var thisProject = Projects.findOne({
            '_id': projectId
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
            '_id': projectId
        });
        oldVersion = thisProject;
        // Add the activity ID to the activity data
        activityData.id = activityId;
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
                    "activityId": activityId,
                    "processId": processId,
                    "projectId": projectId,
                    "activityData": activityData,
                });
                // Add data to activity elements collection
                for (element in activityData) {
                    if (element == "subject" || element == "object" || element == "outcome" || element == "tools" || element == "rules" || element == "roles" ||  element == "community") {
                        ActivityElements.insert({
                            "activityElementId": activityData[element].id,
                            "activityId": activityId,
                            "activityData": activityData,
                            "processId": processId,
                            "projectId": projectId,
                            "activityElementData": activityData[element]
                        });
                    }
                }
                // Return success
                return "success";
            }
        });
    },
    'editActivity': function(projectId, processId, activityId, activityData) {
        // Load the Project
        var thisProject = Projects.findOne({
            '_id': projectId
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
                // Update activities collection
                Activities.update({
                    'activityId': activityId
                }, {
                    $set: {
                        'activityData': activityData
                    }
                });
                // Add data to activities collection
                Activities.insert({
                    "activityId": activityId,
                    "processId": processId,
                    "projectId": projectId,
                    "activityData": activityData,
                });
                // Update activity elements collection
                for (element in activityData) {
                    if (element == "subject" || element == "object" || element == "outcome" || element == "tools" || element == "rules" || element == "roles" ||  element == "community") {
                        ActivityElements.update({
                            "activityId": activityId,
                            "activityElementId": activityData[element].id,
                        }, {
                            $set: {
                                'activityElementData': activityData[element]
                            }
                        });
                    }
                }
                // Return success
                return "success";
            }
        });
    },
    'deleteActivity': function(projectId, processId, activityId) {
        // Load the Project
        var thisProject = Projects.findOne({
            '_id': projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
        Projects.update({
            '_id': projectId,
            'processes.id': processId
        }, {
            $pull: {
                'processes.$.activities': {
                    'id': activityId
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
                // Delete activities and activity elements
                Activities.remove({
                    "activityId": activityId
                });
                ActivityElements.remove({
                    "activityId": activityId
                });
                // Return success
                return "success";
            }
        });
    },
    'addFlow': function(projectId, flowData) {
        // Load the Project
        var thisProject = Projects.findOne({
            '_id': projectId
        });
        oldVersion = thisProject;
        // Add a flow, and add its _id to the project
        var newFlowId = Flows.insert({
            "projectId": projectId,
            "flowData": flowData,
        });
        flowData.id = newFlowId;
        // Apply changes by updating the Project
        Projects.update({
            '_id': projectId
        }, {
            $push: {
                'flows': flowData
            }
        }, function(error) {
            if (error) {
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while adding", flowData.id, "to project", projectId, ".");
                return "error";
            } else {
                console.log("Flow", flowData.id, "added to project", projectId, "successfully.");
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
                // Return success
                return "success";
            }
        });
    },
    'updateFlow': function(projectId, flowId, flowData) {
        // Load the Project
        var thisProject = Projects.findOne({
            '_id': projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
        Projects.update({
            '_id': projectId,
            'flowId': flowId
        }, {
            $set: {
                'flowData': flowData
            }
        }, function(error) {
            if (error) {
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while editing flow", flowId, "of project", projectId, ".");
                return "error";
            } else {
                console.log("Flow", flowId, "edited in project", projectId, "successfully.");
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
                // Update flow in its own collection
                Flows.update({
                    'projectId': projectId,
                    'flowId': flowId
                }, {
                    $push: {
                        "flowData": flowData
                    }
                });
            }
            // Return success
            return "success";
        });
    },
    'deleteFlow': function(flowId, projectId) {
        // Load the Project
        var thisProject = Projects.findOne({
            '_id': projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
        Projects.update({
            '_id': projectId
        }, {
            $pull: {
                'flows': {
                    'id': flowId
                }
            }
        }, {getAutoValues: false}, function(error) {
            if (error) {
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while deleting flow", flowId, "of project", projectId, ".");
                return "error";
            } else {
                console.log("Flow", flowId, "deleted from project", projectId, "successfully.");
                // Save the version of the changes in the Project
                var newVersion = Projects.findOne({
                    '_id': projectId
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
                // Delete flow in its own collection
                Flows.remove(flowId);
                // Return success
                return "success";
            }
        });
    },
    'addContradiction': function(projectId, contradictionData) {
        // Load the Project
        var thisProject = Projects.findOne({
            '_id': projectId
        });
        oldVersion = thisProject;
        // Add a flow, and add its _id to the project
        var newContradictionId = Contradictions.insert({
            "projectId": projectId,
            "contradictionData": contradictionData,
        });
        contradictionData.id = newContradictionId;
        // Apply changes by updating the Project
        Projects.update({
            '_id': projectId
        }, {
            $push: {
                "contradictions": contradictionData
            }
        }, function(error) {
            if (error) {
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while adding contradiction", contradictionData.id, "to project", projectId, ".");
                return "error";
            } else {
                console.log("Contradiction", contradictionData.id, "added to project", projectId, "successfully.");
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
                // Return success
                return "success";
            }
        });
    },
    'updateContradiction': function(projectId, contradictionId, contradictionData) {
        // Load the Project
        var thisProject = Projects.findOne({
            '_id': projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
        Projects.update({
            '_id': projectId,
            'contradictionId': contradictionId
        }, {
            $set: {
                'contradictionData': contradictionData
            }
        }, function(error) {
            if (error) {
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while editing contradiction", contradictionId, "of project", projectId, ".");
                return "error";
            } else {
                console.log("Contradiction", contradictionId, "edited in project", projectId, "successfully.");
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
                // Update flow in its own collection
                Contradictions.update({
                    'projectId': projectId,
                    'contradictionId': contradictionId
                }, {
                    $push: {
                        "contradictionData": contradictionData
                    }
                });
            }
            // Return success
            return "success";
        });
    },
    'deleteContradiction': function(contradictionId, projectId) {
        // Load the Project
        var thisProject = Projects.findOne({
            '_id': projectId
        });
        oldVersion = thisProject;
        // Apply changes by updating the Project
        Projects.update({
            '_id': projectId
        }, {
            $pull: {
                'contradictions': {
                    'id': contradictionId
                }
            }
        }, {getAutoValues: false}, function(error) {
            if (error) {
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while deleting contradiction", contradictionId, "of project", projectId, ".");
                return "error";
            } else {
                console.log("Contradiction", contradictionId, "deleted from project", projectId, "successfully.");
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
                // Delete contradiction in its own collection
                Contradictions.remove({
                    "contradictionId": contradictionId
                });
                // Return success
                return "success";
            }
        });
    },
});

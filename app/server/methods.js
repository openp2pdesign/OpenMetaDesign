/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

import { Projects } from '../lib/collections/projects.js';
import { Activities } from '../lib/collections/activities.js';
import { ActivityElements } from '../lib/collections/activity_elements.js';
import { Settings } from '../lib/collections/settings.js';
import { Flows } from '../lib/collections/flows.js';
import { Contradictions } from '../lib/collections/contradictions.js';
import { Discussions } from '../lib/collections/discussions.js';
import { ProjectsStats } from '../lib/collections/projectsstats.js';

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
            '_id': userId
        });
    },
    'updateUserFirstName': function(userId, newFirstName) {
        Meteor.users.update({
            '_id': userId
        }, {
            $set: {
                "profile.firstName": newFirstName
            }
        });
    },
    'updateUserLastName': function(userId, newLasttName) {
        Meteor.users.update({
            '_id': userId
        }, {
            $set: {
                "profile.lastName": newLastName
            }
        });
    },
    'updateUserBio': function(userId, newBio) {
        Meteor.users.update({
            '_id': userId
        }, {
            $set: {
                "profile.bio": newBio
            }
        });
    },
    'updateUserEmail': function(userId, newEmail) {
        Meteor.users.update({
            '_id': userId
        }, {
            $set: {
                "emails.0.address": newEmail
            }
        });
    },
    'updateGoogleMapsSettings': function(newkey) {
        // There is only one doc for settings...
        var onlySettingsDoc = Settings.findOne();
        Settings.update({
            '_id': onlySettingsDoc._id
        }, {
            $set: {
                'GoogleMapsAPIkey': newkey
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
        console.log("Project", projectId, "created successfully.");
        // Create the Project stats with a first Edit
        var firstStatData = {
            "projectId": projectId,
            "dataByTopic": [{
                    "topic": 1,
                    "dates": [{
                        "value": 1,
                        "date": new Date(),
                    }, ],
                    "topicName": "Edits"
                }, {
                        "topic": 2,
                        "dates": [],
                        "topicName": "Comments"
                    },
            ]
        };
        NewProjectsStats = ProjectsStats.insert(firstStatData);
        return projectId;
    },
    'deleteProject': function(projectId) {
        // First check if it exists...
        let projectFoundId = Projects.findOne({
            '_id': projectId
        });
        if (projectFoundId) {
            Projects.remove({
                '_id': projectId
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
            Contradictions.remove({
                "projectId": projectId
            });
            Discussions.remove({
                "projectId": projectId
            });
            ProjectsStats.remove({
                "projectId": projectId
            });
        } else {
            console.log("Cannot found project", projectId);
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
                throw new Meteor.Error("method_error", "Error", error.reason, "while updating the", field, "field in project", projectId, ".");
                console.log(error);
                return "error";
            } else {
                console.log("Field", field, "updated in project", projectId, "successfully.");
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
                // Add the user to the list of users of the project
                Projects.update({
                    '_id': projectId
                }, {
                    $addToSet: {
                        "users": {
                            "id": Meteor.user()._id,
                            "username": Meteor.user().username
                        }
                    }
                });
                // Update the Edit stats of the project
                ProjectsStats.update({
                    'projectId': projectId,
                    'dataByTopic.topic': 1
                }, {
                    $push: {
                        "dataByTopic.$.dates": {
                            "value": 1,
                            "date": new Date(),
                        }
                    }
                });
                // Return
                return "success";
            }
        });
    },
    'addActivity': function(projectId, processId, activityData) {
        // Load the Project
        var thisProject = Projects.findOne({
            '_id': projectId
        });
        oldVersion = thisProject;
        // Add activity number
        activityData.number = thisProject.activitiesCount + 1;
        // Add data to activities collection
        activityData.id = "newIdToBeReplaced";
        var activityId = Activities.insert({
            "processId": processId,
            "projectId": projectId,
            "activityData": activityData,
        });
        // Add the real activity ID to the activity data, update
        activityData.id = activityId;
        Activities.update({
            '_id': activityId
        }, {
            $set: {
                "activityData": activityData
            }
        });
        // Add data to activity elements collection
        for (element in activityData) {
            if (element == "subject" || element == "object" || element == "outcome" || element == "tools" || element == "rules" || element == "roles" ||  element == "community") {
                ActivityElements.insert({
                    "activityId": activityId,
                    "processId": processId,
                    "projectId": projectId,
                    "activityNumber": activityData.number,
                    "activityElementData": activityData[element]
                });
            }
        }
        // Add the real activity element ID to the activity data, update
        var activityElementsAdded = ActivityElements.find({
            'activityId': activityId
        }).fetch();
        for (document in activityElementsAdded) {
            // Update the main activity data with new ids
            activityData[activityElementsAdded[document].activityElementData.title].id = activityElementsAdded[document]._id;
            // Update activity elements with new ids
            ActivityElements.update({
                'activityId': activityId,
                '_id': activityElementsAdded[document]._id
            }, {
                $set: {
                    "activityElementData.id": activityElementsAdded[document]._id
                }
            });

        }
        // Add the real activity element ID to the activity data, update
        Activities.update({
            '_id': activityId
        }, {
            $set: {
                "activityData": activityData
            }
        });
        // Apply changes by updating the Project
        Projects.update({
            '_id': projectId,
            'processes.id': processId
        }, {
            $push: {
                'processes.$.activities': activityData
            }
        }, function(error, result) {
            if (error) {
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while adding", activityId, "to process", processId, "of project", projectId, ".");
                console.log(error);
                return "error";
            } else {
                console.log("Activity", activityId, "added to process", processId, "of project", projectId, "successfully.");
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
                // Update activities count
                Projects.update({
                    '_id': projectId
                }, {
                    $set: {
                        'activitiesCount': activityData.number
                    }
                });
                // Add the user to the list of users of the project
                Projects.update({
                    '_id': projectId
                }, {
                    $addToSet: {
                        "users": {
                            "id": Meteor.user()._id,
                            "username": Meteor.user().username
                        }
                    }
                });
                // Update the Edit stats of the project
                ProjectsStats.update({
                    'projectId': projectId,
                    'dataByTopic.topic': 1
                }, {
                    $push: {
                        "dataByTopic.$.dates": {
                            "value": 1,
                            "date": new Date(),
                        }
                    }
                });
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
        var thisProjectNewProcess = _.clone(thisProject);
        oldVersion = thisProject;
        // Add the activity ID to the activity data
        activityData.id = activityId;
        // Update the whole document with an updated process
        var thisProcess = "";
        var thisProcess = _.find(thisProjectNewProcess.processes, function(obj) {
            return obj.id === processId;
        });
        var thisActivity = _.find(thisProcess.activities, function(obj) {
            return obj.id === activityId;
        });
        for (activity in thisProcess.activities) {
            if (thisProcess.activities[activity].id == activityId) {
                thisProcess.activities[activity] = activityData;
            }
        }
        // Apply changes by updating the whole Project
        Projects.update({
            '_id': projectId,
            'processes.id': processId
        }, {
            $set: {
                'processes.$.activities': thisProcess.activities
            }
        }, function(error) {
            if (error) {
                console.log(error);
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while updating", activityId, "to process", processId, "of project", projectId, ".");
                console.log(error);
                return "error";
            } else {
                console.log("Activity", activityId, "updated in process", processId, "of project", projectId, "successfully.");
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
                // Add the user to the list of users of the project
                Projects.update({
                    '_id': projectId
                }, {
                    $addToSet: {
                        "users": {
                            "id": Meteor.user()._id,
                            "username": Meteor.user().username
                        }
                    }
                });
                // Update activities collection
                Activities.update({
                    '_id': activityId
                }, {
                    $set: {
                        'activityData': activityData
                    }
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
                // Update the Edit stats of the project
                ProjectsStats.update({
                    'projectId': projectId,
                    'dataByTopic.topic': 1
                }, {
                    $push: {
                        "dataByTopic.$.dates": {
                            "value": 1,
                            "date": new Date(),
                        }
                    }
                });
                // Return success
                return "success";
            }
        });
    },
    'editActivityLocation': function(projectId, processId, activityId, activityLocationData) {
        // Load the Project
        var thisProject = Projects.findOne({
            '_id': projectId
        });
        var thisProjectNewProcess = _.clone(thisProject);
        oldVersion = thisProject;
        // Get all the data of the activity
        var activityData = Activities.findOne({
            '_id': activityId
        }).activityData;
        // Geocode the coordinates, add them
        var activityAddress = activityLocationData.street + " " + activityLocationData.number + " " + activityLocationData.postalcode + " " + activityLocationData.city + " " + activityLocationData.country;
        var options = {
            provider: 'google',
            // Optional depending on the providers
            //apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
            formatter: null // 'gpx', 'string', ...
        };
        // Add Google Maps API key, if it is stored in Settings
        var onlySettingsDoc = Settings.findOne();
        if (onlySettingsDoc.GoogleMapsAPIkey) {
            var geo = new GeoCoder({
                geocoderProvider: "google",
                httpAdapter: "https",
                apiKey: onlySettingsDoc.GoogleMapsAPIkey
            });
        } else {
            var geo = new GeoCoder();
        }
        // Geocode request
        var result = geo.geocode(activityAddress);
        activityLocationData.latitude = result[0].latitude;
        activityLocationData.longitude = result[0].longitude;
        activityLocationData.address = result[0].formattedAddress;
        activityLocationData.geocodedData = result[0];
        // Add the activity location to the activity data
        activityData.location = activityLocationData;
        // Update the whole document with an updated process
        var thisProcess = "";
        var thisProcess = _.find(thisProjectNewProcess.processes, function(obj) {
            return obj.id === processId;
        });
        var thisActivity = _.find(thisProcess.activities, function(obj) {
            return obj.id === activityId;
        });
        for (activity in thisProcess.activities) {
            if (thisProcess.activities[activity].id == activityId) {
                thisProcess.activities[activity] = activityData;
            }
        }
        // Apply changes by updating the whole Project
        Projects.update({
            '_id': projectId,
            'processes.id': processId
        }, {
            $set: {
                'processes.$.activities': thisProcess.activities
            }
        }, function(error) {
            if (error) {
                console.log(error);
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while updating", activityId, "to process", processId, "of project", projectId, ".");
                console.log(error);
                return "error";
            } else {
                console.log("Activity", activityId, "updated in process", processId, "of project", projectId, "successfully.");
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
                // Add the user to the list of users of the project
                Projects.update({
                    '_id': projectId
                }, {
                    $addToSet: {
                        "users": {
                            "id": Meteor.user()._id,
                            "username": Meteor.user().username
                        }
                    }
                });
                // Update activities collection
                Activities.update({
                    '_id': activityId
                }, {
                    $set: {
                        'activityData.location': activityLocationData
                    }
                });
                // Update the Edit stats of the project
                ProjectsStats.update({
                    'projectId': projectId,
                    'dataByTopic.topic': 1
                }, {
                    $push: {
                        "dataByTopic.$.dates": {
                            "value": 1,
                            "date": new Date(),
                        }
                    }
                });
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
        // Update the whole document with an updated process
        var thisProcess = "";
        thisProcess = _.find(thisProject.processes, function(obj) {
            return obj.id === processId;
        });
        var thisNewActivities = thisProcess.activities.filter(function(obj) {
            return obj.id !== activityId;
        });
        // Apply changes by updating the whole Project
        Projects.update({
            '_id': projectId,
            'processes.id': processId
        }, {
            $set: {
                'processes.$.activities': thisNewActivities
            }
        }, function(error) {
            if (error) {
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while deleting", activityId, "to process", processId, "of project", projectId, ".");
                console.log(error);
                return "error";
            } else {
                console.log("Activity", activityId, "deleted from process", processId, "of project", projectId, "successfully.");
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
                // Add the user to the list of users of the project
                Projects.update({
                    '_id': projectId
                }, {
                    $addToSet: {
                        "users": {
                            "id": Meteor.user()._id,
                            "username": Meteor.user().username
                        }
                    }
                });
                // Delete activities and activity elements
                Activities.remove({
                    '_id': activityId
                });
                ActivityElements.remove({
                    "activityId": activityId
                });
                // Update the Edit stats of the project
                ProjectsStats.update({
                    'projectId': projectId,
                    'dataByTopic.topic': 1
                }, {
                    $push: {
                        "dataByTopic.$.dates": {
                            "value": 1,
                            "date": new Date(),
                        }
                    }
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
            'projectId': projectId,
            'flowData': flowData,
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
                console.log(error);
                return "error";
            } else {
                console.log("Flow", flowData.id, "added to project", projectId, "successfully.");
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
                // Add the user to the list of users of the project
                Projects.update({
                    '_id': projectId
                }, {
                    $addToSet: {
                        "users": {
                            "id": Meteor.user()._id,
                            "username": Meteor.user().username
                        }
                    }
                });
                // Update the Edit stats of the project
                ProjectsStats.update({
                    'projectId': projectId,
                    'dataByTopic.topic': 1
                }, {
                    $push: {
                        "dataByTopic.$.dates": {
                            "value": 1,
                            "date": new Date(),
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
            'flows.id': flowId
        }, {
            $set: {
                'flows.$': flowData
            }
        }, function(error) {
            if (error) {
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while updating flow", flowId, "of project", projectId, ".");
                console.log(error);
                return "error";
            } else {
                console.log("Flow", flowId, "updated in project", projectId, "successfully.");
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
                // Add the user to the list of users of the project
                Projects.update({
                    '_id': projectId
                }, {
                    $addToSet: {
                        "users": {
                            "id": Meteor.user()._id,
                            "username": Meteor.user().username
                        }
                    }
                });
                // Update flow in its own collection
                Flows.update({
                    'projectId': projectId,
                    '_id': flowId
                }, {
                    $set: {
                        "flowData": flowData
                    }
                });
            }
            // Update the Edit stats of the project
            ProjectsStats.update({
                'projectId': projectId,
                'dataByTopic.topic': 1
            }, {
                $push: {
                    "dataByTopic.$.dates": {
                        "value": 1,
                        "date": new Date(),
                    }
                }
            });
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
        }, {
            getAutoValues: false
        }, function(error) {
            if (error) {
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while deleting flow", flowId, "of project", projectId, ".");
                console.log(error);
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
                // Add the user to the list of users of the project
                Projects.update({
                    '_id': projectId
                }, {
                    $addToSet: {
                        "users": {
                            "id": Meteor.user()._id,
                            "username": Meteor.user().username
                        }
                    }
                });
                // Delete flow in its own collection
                Flows.remove(flowId);
                // Update the Edit stats of the project
                ProjectsStats.update({
                    'projectId': projectId,
                    'dataByTopic.topic': 1
                }, {
                    $push: {
                        "dataByTopic.$.dates": {
                            "value": 1,
                            "date": new Date(),
                        }
                    }
                });
                // Return success
                return "success";
            }
        });
    },
    'contradictionLevel': function(firstNode, secondNode) {
        // Compute the level of contradiction
        // See for example:
        //KARANASIOS, S., RIISLA, K. and SIMEONOVA, B., 2017. Exploring the use of contradictions in activity theory studies: An interdisciplinary review. Presented at the 33rd EGOS Colloquium: The Good Organization, Copenhagen, July 6-8th.
        //https://dspace.lboro.ac.uk/dspace-jspui/bitstream/2134/26026/1/PDF.pdf
        var level = 0;
        // if id is == then 1
        if (firstNode === secondNode) {
            level = "primary";
        } else {
            // Otherwise, load full activity elements and keep checking
            var firstActivityElement = ActivityElements.findOne({
                '_id': firstNode
            })
            var secondActivityElement = ActivityElements.findOne({
                '_id': secondNode
            })
            // if id is != but activity is == then it's secondary level
            if (firstActivityElement.activityId === secondActivityElement.activityId) {
                level = "secondary";
            } else {
                // if id is != and activity is != then:
                // if the second is a more advanced version of this activity
                // that means, they connect the same object, it's ternary
                if (firstActivityElement.activityElementData.title === "object" && secondActivityElement.activityElementData.title === "object") {
                    level = "tertiary";
                } else {
                    // otherwise it's a quaternary level
                    level = "quaternary";
                }

            }
        }
        return level;
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
                console.log(error);
                return "error";
            } else {
                console.log("Contradiction", contradictionData.id, "added to project", projectId, "successfully.");
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
                // Add the user to the list of users of the project
                Projects.update({
                    '_id': projectId
                }, {
                    $addToSet: {
                        "users": {
                            "id": Meteor.user()._id,
                            "username": Meteor.user().username
                        }
                    }
                });
                // Update the Edit stats of the project
                ProjectsStats.update({
                    'projectId': projectId,
                    'dataByTopic.topic': 1
                }, {
                    $push: {
                        "dataByTopic.$.dates": {
                            "value": 1,
                            "date": new Date(),
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
            'contradictions.id': contradictionId
        }, {
            $set: {
                'contradictions.$': contradictionData
            }
        }, function(error) {
            if (error) {
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while updating contradiction", contradictionId, "of project", projectId, ".");
                console.log(error);
                return "error";
            } else {
                console.log("Contradiction", contradictionId, "updated in project", projectId, "successfully.");
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
                // Add the user to the list of users of the project
                Projects.update({
                    '_id': projectId
                }, {
                    $addToSet: {
                        "users": {
                            "id": Meteor.user()._id,
                            "username": Meteor.user().username
                        }
                    }
                });
                // Update contradiction in its own collection
                Contradictions.update({
                    'projectId': projectId,
                    '_id': contradictionId
                }, {
                    $set: {
                        "contradictionData": contradictionData
                    }
                });
            }
            // Update the Edit stats of the project
            ProjectsStats.update({
                'projectId': projectId,
                'dataByTopic.topic': 1
            }, {
                $push: {
                    "dataByTopic.$.dates": {
                        "value": 1,
                        "date": new Date(),
                    }
                }
            });
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
        }, {
            getAutoValues: false
        }, function(error) {
            if (error) {
                throw new Meteor.Error("method_error", error.reason);
                console.log("Error", error.reason, "while deleting contradiction", contradictionId, "of project", projectId, ".");
                console.log(error);
                return "error";
            } else {
                console.log("Contradiction", contradictionId, "deleted from project", projectId, "successfully.");
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
                // Add the user to the list of users of the project
                Projects.update({
                    '_id': projectId
                }, {
                    $addToSet: {
                        "users": {
                            "id": Meteor.user()._id,
                            "username": Meteor.user().username
                        }
                    }
                });
                // Delete contradiction in its own collection
                Contradictions.remove({
                    '_id': contradictionId
                });
                // Update the Edit stats of the project
                ProjectsStats.update({
                    'projectId': projectId,
                    'dataByTopic.topic': 1
                }, {
                    $push: {
                        "dataByTopic.$.dates": {
                            "value": 1,
                            "date": new Date(),
                        }
                    }
                });
                // Return success
                return "success";
            }
        });
    },
    'updateDiscussion': function(roomId, discussionData) {
        // Get the project id from the roomId
        var projectId = roomId.split("-")[0];
        // Look for existing discussions
        var thisDiscussion = Discussions.findOne({
            'roomId': roomId
        });
        if (typeof thisDiscussion !== "undefined") {
            // If the discussion exists, update it
            Discussions.update({
                '_id': thisDiscussion._id
            }, {
                $push: {
                    'comments': discussionData
                }
            }, function(error) {
                if (error) {
                    throw new Meteor.Error("method_error", error.reason);
                    console.log("Error", error.reason, "while updating discussion in room", roomId, "of project", projectId, ".");
                    console.log(error);
                    return "error";
                } else {
                    console.log("Discussion in room", roomId, "updated in project", projectId, "successfully.");
                }
                // Update the Comments stats of the project
                ProjectsStats.update({
                    'projectId': projectId,
                    'dataByTopic.topic': 2
                }, {
                    $push: {
                        "dataByTopic.$.dates": {
                            "value": 1,
                            "date": new Date(),
                        }
                    }
                });
                // Return success
                return "success";
            });
            // Update the number of comments in the discussion
            Discussions.update({
                '_id': thisDiscussion._id
            }, {
                $set: {
                    'numberOfComments': thisDiscussion.numberOfComments + 1
                }
            });
        } else {
            var attachedTo = roomId.split("-")[1];
            var attachedToDescription = "";
            var icon = "";
            // Get the type of the element to which the discussion is attached
            if (typeof Flows.findOne({
                    '_id': attachedTo
                }) !== "undefined") {
                attachedToDescription = "Flow: " + Flows.findOne({
                    '_id': attachedTo
                }).flowData.title;
                icon = "fa fa-random";
            } else if (typeof Contradictions.findOne({
                    '_id': attachedTo
                }) !== "undefined") {
                attachedToDescription = "Contradiction: " + Contradictions.findOne({
                    '_id': attachedTo
                }).contradictionData.title;
                icon = "fa fa-exclamation-triangle";
            } else if (typeof Activities.findOne({
                    '_id': attachedTo
                }) !== "undefined") {
                var thisActivityDiscussed = Activities.findOne({
                    '_id': attachedTo
                });
                attachedToDescription = "Activity #" + thisActivityDiscussed.activityData.number + ": " + thisActivityDiscussed.activityData.title;
                icon = "icomoon-activity";
            } else {
                attachedToDescription = attachedTo.charAt(0).toUpperCase() + attachedTo.substr(1);
                icon = "fa fa-book";
            }
            // Create the discussion and add the data
            var thisNewDiscussion = Discussions.insert({
                "roomId": roomId,
                "projectId": projectId,
                "attachedTo": attachedTo,
                "attachedToDescription": attachedToDescription,
                "comments": [discussionData],
                "numberOfComments": 1,
                "icon": icon,
            }, function(error) {
                if (error) {
                    throw new Meteor.Error("method_error", error.reason);
                    console.log("Error", error.reason, "while updating discussion in room", roomId, "of project", projectId, ".");
                    console.log(error);
                    return "error";
                } else {
                    console.log("Discussion in room", roomId, "updated in project", projectId, "successfully.");
                }
                // Update the Comments stats of the project
                ProjectsStats.update({
                    'projectId': projectId,
                    'dataByTopic.topic': 2
                }, {
                    $push: {
                        "dataByTopic.$.dates": {
                            "value": 1,
                            "date": new Date(),
                        }
                    }
                });
                // Return success
                return "success";
            });
        }
        // Save the id of the new discussion in the project and specific element
        var thisDiscussion = Discussions.findOne({
            'roomId': roomId
        });
        if (typeof thisDiscussion !== "undefined") {
            var thisElement = roomId.split("-")[1];
            var thisDiscussionData = {
                "attachedTo": thisElement,
                "discussion": thisDiscussion._id
            }
            // Add it to the list of discussions
            Projects.update({
                '_id': projectId
            }, {
                $push: {
                    'discussions': thisDiscussionData
                }
            });
            // Add the discussion id to contradictions, flows or activities
            // Contradictions
            var thisDocument = Contradictions.findOne({
                '_id': thisElement
            });
            if (typeof thisDocument !== "undefined") {
                // Update the data
                Contradictions.update({
                    '_id': thisDocument
                }, {
                    $set: {
                        'contradictionData.discussion': thisDiscussion._id
                    }
                });
            }
            // Flows
            var thisDocument = Flows.findOne({
                '_id': thisElement
            });
            if (typeof thisDocument !== "undefined") {
                // Update the data
                Flows.update({
                    '_id': thisDocument
                }, {
                    $set: {
                        'flowData.discussion': thisDiscussion._id
                    }
                });
            }
            // Activities
            var thisDocument = Activities.findOne({
                '_id': thisElement
            });
            if (typeof thisDocument !== "undefined") {
                // Update the data
                Activities.update({
                    '_id': thisDocument
                }, {
                    $set: {
                        'activityData.discussion': thisDiscussion._id
                    }
                });
            }
        }
    },
});

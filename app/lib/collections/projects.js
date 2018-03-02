import { Random } from 'meteor/random';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

SimpleSchema.debug = true;

// Collection of Projects
export const Projects = new Mongo.Collection('projects');

// if (Meteor.isServer) {
//     Projects.allow({
//         insert: function(userId, doc) {
//             return true;
//         },
//
//         update: function(userId, doc, fieldNames, modifier) {
//             // The user must be logged in and the document must be owned by the user.
//             return userId && doc.owner === userId;
//         },
//
//         remove: function(userId, doc) {
//             // Can only remove your own documents.
//             return doc.owner === userId;
//         }
//     });
// }

if (Meteor.isServer) {
    Projects.allow({
        insert: function(userId, doc) {
            return false;
        },

        update: function(userId, doc, fieldNames, modifier) {
            return false;
        },

        remove: function(userId, doc) {
            return false;
        }
    });
}

if (Meteor.isClient) {
    Projects.allow({
        insert: function(userId, doc) {
            return true;
        },

        update: function(userId, doc, fieldNames, modifier) {
            return true;
        },

        remove: function(userId, doc) {
            return true;
        }
    });
}

// Schemas
// Elaborated from https://gist.github.com/openp2pdesign/dba8cdfa0c4293b2d5e93f6a0835a755

// A schema for a location
export const LocationSchema = new SimpleSchema({
    street: {
        type: String,
        max: 100,
        optional: true
    },
    number: {
        type: Number,
        optional: true
    },
    city: {
        type: String,
        max: 100,
        optional: true
    },
    postalcode: {
        type: String,
        max: 50,
        optional: true
    },
    country: {
        type: String,
        max: 50,
        optional: true
    },
    url: {
        type: Array,
        regEx: SimpleSchema.RegEx.Url,
        max: 5,
        optional: true
    },
    'url.$': String,
    latitude: {
        type: Number,
        optional: true
    },
    longitude: {
        type: Number,
        optional: true
    }

});


// A schema for a time interval
export const TimeIntervalSchema = new SimpleSchema({
    start: {
        type: Date
    },
    end: {
        type: Date
    },
    startLocation: {
        type: LocationSchema,
        optional: true
    },
    endLocation: {
        type: LocationSchema,
        optional: true
    }
});


// A schema for a comment
export const CommentSchema = new SimpleSchema({
    id: {
        type: String
    },
    body: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdByID: {
        type: String
    },
    createdAt: {
        type: Date
    },
    roomId: {
        type: String
    }
});

// A schema for discussions
export const DiscussionSchema = new SimpleSchema({
    attachedTo: {
        type: String
    },
    comments: {
        type: Array,
    },
    'comments.$': CommentSchema
});

// A schema for a contradiction
export const ContradictionSchema = new SimpleSchema({
    id: {
        type: String,
        optional: true
    },
    title: {
        type: String,
        max: 100
    },
    description: {
        type: String,
    },
    level: {
        type: String
    },
    firstNode: {
        type: String
    },
    secondNode: {
        type: String
    },
    discussion: {
        type: DiscussionSchema,
        optional: true
    }
});

// A schema for a flow
export const FlowSchema = new SimpleSchema({
    id: {
        type: String,
        optional: true
    },
    title: {
        type: String,
        max: 100
    },
    description: {
        type: String,
        optional: true
    },
    resource: {
        type: String
    },
    type: {
        type: String,
        allowedValues: [
            'information or digital resources',
            'financial resources',
            'material resources'
        ]
    },
    weight: {
        type: Number,
        defaultValue: 0
    },
    firstNode: {
        type: String
    },
    secondNode: {
        type: String
    },
    discussion: {
        type: DiscussionSchema,
        optional: true
    }
});

// A schema for an activity element
export const ActivityElementSchema = new SimpleSchema({
    id: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    }
});

// A schema for an activity
export const ActivitySchema = new SimpleSchema({
    id: {
        type: String
    },
    number: {
        type: Number,
        defaultValue: 1
    },
    title: {
        type: String,
        max: 100,
    },
    description: {
        type: String,
    },
    subject: {
        type: ActivityElementSchema,
    },
    object: {
        type: ActivityElementSchema,
    },
    outcome: {
        type: ActivityElementSchema,
    },
    tools: {
        type: ActivityElementSchema,
    },
    rules: {
        type: ActivityElementSchema,
    },
    roles: {
        type: ActivityElementSchema,
    },
    community: {
        type: ActivityElementSchema,
    },
    time: {
        type: TimeIntervalSchema
    },
    location: {
        type: LocationSchema,
        optional: true
    },
    discussion: {
        type: DiscussionSchema,
        optional: true
    },
    participation: {
        type: String,
        allowedValues: ["No participation",
            "Indirect participation",
            "Consultative participation",
            "Shared control",
            "Full control"
        ]
    }
});

// A schema for a process
export const ProcessSchema = new SimpleSchema({
    id: {
        type: String,
        autoValue: function() {
            return Random.id();
        }
    },
    title: {
        type: String,
        max: 100
    },
    activities: {
        type: Array,
        optional: true
    },
    'activities.$': ActivitySchema,
    discussion: {
        type: DiscussionSchema,
        optional: true
    }
});

// A schema for the separator lines between the processes
export const SeparatorSchema = new SimpleSchema({
    id: {
        type: String,
        autoValue: function() {
            return Random.id();
        }
    },
    first: {
        type: String
    },
    second: {
        type: String
    },
    text: {
        type: String,
        max: 140
    },
});

// A schema for a license
export const LicenseSchema = new SimpleSchema({
    title: {
        type: String,
        max: 100
    },
    url: {
        type: String,
        regEx: SimpleSchema.RegEx.Url
    },
    discussion: {
        type: DiscussionSchema,
        optional: true
    }
});

// A schema for versioning the project
export const VersionSchema = new SimpleSchema({
    number: {
        type: Number,
        defaultValue: 0
    },
    id: {
        type: String,
        autoValue: function() {
            return Random.id();
        }
    },
    diff: {
        type: String,
        optional: true,
        blackbox: true
    },
    updatedAt: {
        type: Date,
        autoValue: function() {
            return new Date();
        }
    },
    updatedAtBy: {
        type: String,
        autoValue: function() {
            var updatedByUser = Meteor.users.findOne({
                _id: this.userId
            });
            return updatedByUser.username;
        }
    },
    updatedAtByID: {
        type: String,
        autoValue: function() {
            return this.userId;
        }
    },
});

// A schema for a meta-design project
export const ProjectSchema = new SimpleSchema({
    title: {
        type: String,
        max: 200
    },
    description: {
        type: String,
        max: 1024
    },
    license: {
        type: LicenseSchema
    },
    release: {
        type: String,
        max: 10
    },
    createdBy: {
        type: String,
        autoValue: function() {
            var createdByUser = Meteor.users.findOne({
                _id: this.userId
            });
            return createdByUser.username;
        }
    },
    createdByID: {
        type: String,
        autoValue: function() {
            return this.userId;
        }
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            }
        }
    },
    lastUpdatedAt: {
        type: Date,
        autoValue: function() {
            return new Date();
        }
    },
    lastUpdatedBy: {
        type: String,
        autoValue: function() {
            var updatedByUser = Meteor.users.findOne({
                _id: this.userId
            });
            return updatedByUser.username;
        }
    },
    lastUpdatedByID: {
        type: String,
        autoValue: function() {
            return this.userId;
        }
    },
    versions: {
        type: Array,
    },
    'versions.$': VersionSchema,
    versionsCount: {
        type: Number,
        autoValue: function() {
            if (this.isInsert) {
                return 1;
            } else if (this.isUpdate) {
                var thisProject = Projects.findOne({
                    _id: this.docId
                });
                return thisProject.versions.length + 1;
            }
        }
    },
    designers: {
        type: String
    },
    community: {
        type: String,
        max: 1024
    },
    processes: {
        type: Array,
    },
    'processes.$': ProcessSchema,
    separators: {
        type: Array,
    },
    'separators.$': SeparatorSchema,
    flows: {
        type: Array,
        optional: true
    },
    'flows.$': {
        type: FlowSchema,
    },
    contradictions: {
        type: Array,
        optional: true
    },
    'contradictions.$': {
        type: ContradictionSchema
    },
    activitiesCount: {
        type: Number,
        defaultValue: 0
    },
    discussions: {
        type: Array,
    },
    'discussions.$': DiscussionSchema,
});

// Attach the ProjectSchema to the projects collection
Projects.attachSchema(ProjectSchema);

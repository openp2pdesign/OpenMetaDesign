import {
    Random
} from 'meteor/random';
import {
    Mongo
} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

SimpleSchema.debug = true;

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

// A schema for a GEOjson point
// See more here:
// https://forums.meteor.com/t/howto-use-simpleschema-to-fill-geodata-in-database/9855/2
// http://joshowens.me/using-mongodb-geospatial-index-with-meteor-js/
PointSchema = new SimpleSchema({
    location: {
        type: Object,
        index: "2dsphere"
    },
    type: {
        type: String,
        allowedValues: ["Point"]
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    }
});

// A schema for a location
LocationSchema = new SimpleSchema({
    street: {
        type: String,
        max: 100
    },
    number: {
        type: Number
    },
    city: {
        type: String,
        max: 50
    },
    postalcode: {
        type: String,
        max: 50
    },
    country: {
        type: String,
        max: 50
    },
    url: {
        type: Array,
        regEx: SimpleSchema.RegEx.Url,
        max: 5,
        optional: true
    },
    'url.$': String,
    location: {
        type: String
    }

});

// A schema for a time interval
TimeIntervalSchema = new SimpleSchema({
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


// A schema for a discussion
DiscussionSchema = new SimpleSchema({
    title: {
        type: String,
        max: 100
    },
    labels: {
        type: Array,
        max: 50
    },
    'labels.$': String,
    start: {
        type: Date,
        optional: true
    },
    status: {
        type: String,
        optional: true
    }
});

// A schema for a message in the discussion
// See https://github.com/cesarve77/simple-chat
MessageSchema = new SimpleSchema({});

// A schema for an activity element
ActivityElementSchema = new SimpleSchema({
    description: {
        type: String
    }
});

// A schema for a contradiction
ContradictionSchema = new SimpleSchema({
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
    description: {
        type: String,
    },
    kind: {
        type: Array,
        allowedValues: [
            'primary',
            'secondary',
            'tertiary',
            'quaternary'
        ]
    },
    'kind.$': String,
    firstNode: {
        type: String
    },
    secondNode: {
        type: String
    },
    reciprocal: {
        type: Boolean
    },
    // discussion: {
    //     type: DiscussionSchema,
    //     optional: true
    // }
});

// A schema for a flow
FlowSchema = new SimpleSchema({
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
    description: {
        type: String,
        optional: true
    },
    resource: {
        type: String
    },
    options: {
        type: Array,
        allowedValues: [
            'information or digital resources',
            'financial resources',
            'material resources'
        ]
    },
    'options.$': String,
    weight: {
        type: Number
    },
    firstNode: {
        type: String
    },
    secondNode: {
        type: String
    },
    reciprocal: {
        type: Boolean
    },
    // discussion: {
    //     type: DiscussionSchema,
    //     optional: true
    // }
});

// A schema for an activity
ActivitySchema = new SimpleSchema({
    id: {
        type: String,
        autoValue: function() {
            return Random.id();
        }
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
        type: String,
    },
    object: {
        type: String,
    },
    outcome: {
        type: String,
    },
    tools: {
        type: String,
    },
    rules: {
        type: String,
    },
    roles: {
        type: String,
    },
    community: {
        type: String,
    },
    time: {
        type: TimeIntervalSchema
    },
    // location: {
    //     type: LocationSchema
    // },
    // discussion: {
    //     type: DiscussionSchema
    // },
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
ProcessSchema = new SimpleSchema({
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
    // participants: {
    //     type: [String]
    // },
    // discussion: {
    //     type: DiscussionSchema,
    //     optional: true
    // }
});

// A schema for the separator lines between the processes
SeparatorSchema = new SimpleSchema({
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
LicenseSchema = new SimpleSchema({
    title: {
        type: String,
        max: 100
    },
    url: {
        type: Array,
        regEx: SimpleSchema.RegEx.Url,
        max: 50
    },
    'url.$': String,
    discussion: {
        type: DiscussionSchema,
        optional: true
    }
});

// A schema for versioning the project
VersionSchema = new SimpleSchema({
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
ProjectSchema = new SimpleSchema({
    title: {
        type: String,
        max: 200
    },
    description: {
        type: String,
        max: 1024
    },
    // license: {
    //     type: LicenseSchema,
    //     label: "License"
    // },
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
    // founders: {
    //     type: [String],
    //     label: "Founders"
    // },
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
        autoValue: function() {
            if (this.isInsert) {
                return 0;
            } else if (this.isUpdate) {
                var thisProject = Projects.findOne({
                    _id: this.docId
                });
                return thisProject.activitiesCount + 1;
            }
        }
    },
});

// Attach the ProjectSchema to the projects collection
Projects.attachSchema(ProjectSchema);

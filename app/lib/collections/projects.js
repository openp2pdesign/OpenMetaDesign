Projects = new Mongo.Collection('projects');


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
        type: Number,
        decimal: true,
        label: "Latitude"
    },
    lng: {
        type: Number,
        decimal: true,
        label: "Longitude"
    }
});

// A schema for a location
LocationSchema = new SimpleSchema({
    street: {
        type: String,
        label: "Street",
        max: 100
    },
    number: {
        type: Number,
        label: "Number"
    },
    city: {
        type: String,
        label: "City",
        max: 50
    },
    postalcode: {
        type: String,
        label: "Postal Code",
        max: 50
    },
    country: {
        type: String,
        label: "Country",
        max: 50
    },
    url: {
        type: [String],
        label: "URL",
        regEx: SimpleSchema.RegEx.Url,
        max: 5
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
    startWhere: {
        type: LocationSchema,
        optional: true
    },
    endWhere: {
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
        type: [String],
        max: 50
    },
    start: {
        type: Date
    },
    status: {
        type: String
    }
});

// A schema for a message in the discussion
// See https://github.com/cesarve77/simple-chat
MessageSchema = new SimpleSchema({});

// A schema for an activity element
ActivityElementSchema = new SimpleSchema({
    description: {
        type: String
    },
    where: {
        type: LocationSchema,
        optional: true
    }
});

// A schema for a contradiction
ContradictionSchema = new SimpleSchema({
    kind: {
        type: [String],
        allowedValues: [
            'primary',
            'secondary',
            'tertiary',
            'quaternary'
        ]
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
    discussion: {
        type: DiscussionSchema
    }
});

// A schema for a flow
FlowSchema = new SimpleSchema({
    title: {
        type: String,
        max: 100
    },
    resource: {
        type: String
    },
    options: {
        type: [String],
        allowedValues: [
            'information or digital resources',
            'financial resources',
            'material resources'
        ]
    },
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
    discussion: {
        type: DiscussionSchema
    }
});

// A schema for an activity
ActivitySchema = new SimpleSchema({
    title: {
        type: String,
        max: 100
    },
    description: {
        type: String
    },
    subject: {
        type: ActivityElementSchema,
        label: "Subject"
    },
    object: {
        type: ActivityElementSchema,
        label: "Object"
    },
    outcome: {
        type: ActivityElementSchema,
        label: "Outcome"
    },
    tools: {
        type: ActivityElementSchema,
        label: "Tools"
    },
    rules: {
        type: ActivityElementSchema,
        label: "Rules"
    },
    roles: {
        type: ActivityElementSchema,
        label: "Roles"
    },
    community: {
        type: ActivityElementSchema,
        label: "Community"
    },
    time: {
        type: TimeIntervalSchema
    },
    where: {
        type: LocationSchema
    },
    discussion: {
        type: DiscussionSchema
    },
    participation: {
        type: [String],
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
    title: {
        type: String,
        max: 100
    },
    activities: {
        type: [ActivitySchema]
    },
    participants: {
        type: [String]
    },
    where: {
        type: LocationSchema
    },
    flows: {
        type: [FlowSchema]
    },
    contradictions: {
        type: [ContradictionSchema]
    },
    discussion: {
        type: DiscussionSchema
    }
});

// A schema for a license
LicenseSchema = new SimpleSchema({
    title: {
        type: String,
        max: 100
    },
    url: {
        type: [String],
        regEx: SimpleSchema.RegEx.Url,
        max: 50
    },
    discussion: {
        type: DiscussionSchema
    }
});

// A schema for a meta-design project
ProjectSchema = new SimpleSchema({
    title: {
        type: String,
        label: "Title",
        max: 200
    },
    description: {
        type: String,
        label: "Description",
        max: 1024
    },
    version: {
        type: String,
        label: "Version",
        max: 15
    },
    founders: {
        type: [String],
        label: "Founders"
    },
    processes: {
        type: [ProcessSchema],
        label: "Processes"
    },
    createdBy: {
        type: String,
        autoValue: function() {
            return this.userId
        }
    }
});

// Attach the ProjectSchema to the projects collection
Projects.attachSchema(ProjectSchema);

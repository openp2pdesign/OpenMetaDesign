// Collection of Activities, for the autocomplete
export const Activities = new Mongo.Collection('activities');


if (Meteor.isServer) {
  Activities.allow({
    insert: function (userId, doc) {
      return false;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return false;
    },

    remove: function (userId, doc) {
      return false;
    }
  });

  Activities.deny({
    insert: function (userId, doc) {
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return true;
    }
  });
}

// A schema for an activity for the autocomplete
ActivityAutocompleteSchema = new SimpleSchema({
    activityId: {
        type: String,
    },
    processId: {
        type: String,
    },
    projectId: {
        type: String,
    },
    number: {
        type: Number
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

// Attach the ActivityAutocompleteSchema to the Activities collection
Activities.attachSchema(ActivityAutocompleteSchema);

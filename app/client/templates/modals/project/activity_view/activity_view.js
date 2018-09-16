/*****************************************************************************/
/* ActivityView: Event Handlers */
/*****************************************************************************/
Template.ActivityView.events({
});

/*****************************************************************************/
/* ActivityView: Helpers */
/*****************************************************************************/
Template.ActivityView.helpers({
    data: function() {
        // Return helper values for the template
        var dataValue = {};
        if (this.mode === "edit") {
            dataValue = {
                "project": thisProject,
                "process": this.process,
                "activity": thisActivity,
                "mode": this.mode
            }
        } else {
            thisActivity = {
                "title": "A new activity",
                "description": "Write here a description of the activity.",
                "subject": "Who is doing the activity?",
                "object": "What is the object of the activity?",
                "outcome": "What is the outcome of the activity?",
                "tools": "Which are the tools, knowledge and systems used in the activity?",
                "rules": "Which are the rules followed in the activity?",
                "roles": "How is the work in the activity organized into roles?",
                "community": "Which is the greater community where the activity takes place?",
                "time": {
                    "start": new Date(),
                    "end": new Date()
                },
                "participation": "Full control"
            }
            dataValue = {
                "project": thisProject,
                "process": this.process,
                "activity": thisActivity,
                "mode": this.mode
            }
        }
        return dataValue;
    },
    equals: function(a, b) {
        // Compare variables, for if section in Blaze template
        return a == b;
    },
});

/*****************************************************************************/
/* ActivityView: Lifecycle Hooks */
/*****************************************************************************/
Template.ActivityView.onCreated(function () {
});

Template.ActivityView.onRendered(function () {
});

Template.ActivityView.onDestroyed(function () {
});

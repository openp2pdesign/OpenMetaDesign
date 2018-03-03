/*****************************************************************************/
/* ProjectDiscussions: Event Handlers */
/*****************************************************************************/
Template.ProjectDiscussions.events({
    'click .open-discussion': function(event, template) {
        event.preventDefault();
        console.log(this);
        // Pass the discussion id to Sessions
        Session.set('discussionToShow', this._id);
    },
});

/*****************************************************************************/
/* ProjectDiscussions: Helpers */
/*****************************************************************************/
Template.ProjectDiscussions.helpers({
    data: function() {
        return {
            "project": this._id,
            "discussions": this.discussions
        }
    },
    thisDiscussion: function() {
        if (typeof Session.get('discussionToShow') !== "undefined") {
            return Session.get('discussionToShow');
        }
    }
});

/*****************************************************************************/
/* ProjectDiscussions: Lifecycle Hooks */
/*****************************************************************************/
Template.ProjectDiscussions.onCreated(function () {
});

Template.ProjectDiscussions.onRendered(function () {
});

Template.ProjectDiscussions.onDestroyed(function () {
});

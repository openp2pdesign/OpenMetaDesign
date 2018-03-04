/*****************************************************************************/
/* ProjectDiscussions: Event Handlers */
/*****************************************************************************/
Template.ProjectDiscussions.events({
    'click .open-discussion': function(event, template) {
        event.preventDefault();
        console.log("DISCU", this);
        // var newFirstNode = $('#new-contradiction-first-node option:selected').attr('data-option');
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
    },
    thisRoomId: function() {
        return this.project + '-' + this.field;
    },
    thisUsername: function() {
        return Meteor.user().username;
    },
    thisName: function() {
        var name = Meteor.user().profile.firstName + ' ' + Meteor.user().profile.lastName;
        return name;
    },
    thisGravatar: function() {
        return Meteor.user().profile.avatar;
    },
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

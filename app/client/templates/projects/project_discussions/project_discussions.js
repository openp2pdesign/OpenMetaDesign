import { Projects } from '../../../../lib/collections/projects.js';
import { Discussions } from '../../../../lib/collections/discussions.js';
// jquery
import { $ } from 'meteor/jquery';

/*****************************************************************************/
/* ProjectDiscussions: Event Handlers */
/*****************************************************************************/
Template.ProjectDiscussions.events({
    'click .list-group-item': function(event, template) {
        event.preventDefault();
        // Pass the discussion id to Sessions
        Session.set('discussionToShow', event.currentTarget.id);
        // Reload the discussion
        // Empty the div
        $("#selectedDiscussion").empty();
        // Reload template with new data
        Blaze.render(Template.Discuss, document.getElementById('selectedDiscussion'));
    },
});

/*****************************************************************************/
/* ProjectDiscussions: Helpers */
/*****************************************************************************/
Template.ProjectDiscussions.helpers({
    data: function() {
        return {
            "project": this._id,
            "discussions": Discussions.find({'projectId': this._id}).fetch()
        }
    },
    thisRoomId: function() {
        var thisDiscussion = Session.get('discussionToShow');
        if (typeof thisDiscussion !== "undefined") {
            return thisDiscussion;
        }
    },
    thisRoomTitle: function() {
        var thisDiscussion = Session.get('discussionToShow');
        if (typeof thisDiscussion !== "undefined") {
            return Discussions.findOne({ 'roomId': thisDiscussion }).attachedToType;
        }
    },
});

/*****************************************************************************/
/* ProjectDiscussions: Lifecycle Hooks */
/*****************************************************************************/
Template.ProjectDiscussions.onCreated(function () {
    self.subscription = Meteor.subscribe('projects');
    self.subscription = Meteor.subscribe('discussions');
    Session.set('discussionToShow', null);
});

Template.ProjectDiscussions.onRendered(function () {
    // Empty the div, default
    $("#selectedDiscussion").empty();
});

Template.ProjectDiscussions.onDestroyed(function () {
});

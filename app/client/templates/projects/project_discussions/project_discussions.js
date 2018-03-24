import { Projects } from '../../../../lib/collections/projects.js';
import { Discussions } from '../../../../lib/collections/discussions.js';
// jquery
import { $ } from 'meteor/jquery';

/*****************************************************************************/
/* ProjectDiscussions: Event Handlers */
/*****************************************************************************/
Template.ProjectDiscussions.events({
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
            var thisData = Discussions.findOne({ 'roomId': thisDiscussion });
            if (typeof thisData !== "undefined") {
                return thisData.attachedToDescription;
            }
        }
    },
});

/*****************************************************************************/
/* ProjectDiscussions: Lifecycle Hooks */
/*****************************************************************************/
Template.ProjectDiscussions.onCreated(function () {
    Meteor.subscribe('projects');
    Meteor.subscribe('discussions');
    Session.set('discussionToShow', null);
});

Template.ProjectDiscussions.onRendered(function () {
    // Empty the div, default
    $("#selectedDiscussion").empty();
});

Template.ProjectDiscussions.onDestroyed(function () {
});

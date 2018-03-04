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
    selectedDiscussion: function() {
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
    self.subscription = Meteor.subscribe('projects');
    self.subscription = Meteor.subscribe('discussions');
});

Template.ProjectDiscussions.onRendered(function () {
});

Template.ProjectDiscussions.onDestroyed(function () {
});

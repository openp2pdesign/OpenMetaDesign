import { Projects } from '../../../../lib/collections/projects.js';
import { Discussions } from '../../../../lib/collections/discussions.js';

/*****************************************************************************/
/* DiscussionButtons: Event Handlers */
/*****************************************************************************/
Template.DiscussionButtons.events({
    // Open the modal that enable the discussion
    'click .open-discussion': function(event, template) {
        event.preventDefault();
        // Get IDs of project and discussion
        var thisDiscussionID = this._id;
        var thisDiscussionData = Discussions.findOne({ '_id': thisDiscussionID });
        var thisAttachedTo = thisDiscussionData.attachedTo;
        var thisProjectID = thisDiscussionData.projectId;
        Session.set('thisProject', thisProjectID);
        Session.set('discussionToShow', thisProjectID + "-" + thisAttachedTo);
        // Launch modal
        Modal.show('DiscussModal', function() {
            return {
                "discussionId": thisDiscussionID
            }
        });
    },
});

/*****************************************************************************/
/* DiscussionButtons: Helpers */
/*****************************************************************************/
Template.DiscussionButtons.helpers({
});

/*****************************************************************************/
/* DiscussionButtons: Lifecycle Hooks */
/*****************************************************************************/
Template.DiscussionButtons.onCreated(function () {
    Meteor.subscribe('projects');
    Meteor.subscribe('discussions');
});

Template.DiscussionButtons.onRendered(function () {
});

Template.DiscussionButtons.onDestroyed(function () {
});

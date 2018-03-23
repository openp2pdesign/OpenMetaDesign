import { Projects } from '../../../../lib/collections/projects.js';
import { Discussions } from '../../../../lib/collections/discussions.js';

/*****************************************************************************/
/* DiscussionButtons: Event Handlers */
/*****************************************************************************/
Template.DiscussionButtons.events({
    // Open the modal that enable the discussion
    'click .open-discussion': function(event, template) {
        event.preventDefault();
        // Launch modal
        Modal.show('DiscussModal', function() {
            var thisProjectID = Projects.findOne({ 'discussions': {'$in': [template.data._id]} })._id;
            var thisDiscussion = Discussions.findOne({ '_id': template.data._id});
            Session.set('thisProject', thisProjectID);
            Session.set('discussionToShow', thisProjectID + "-" + thisDiscussion.attachedTo);
            return {
                "discussionId": template.data._id
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

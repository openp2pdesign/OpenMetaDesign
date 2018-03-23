import { Projects } from '../../../../lib/collections/projects.js';

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
            Session.set('thisProject', thisProjectID);
            Session.set('discussionToShow', thisProjectID + "-" + template.data.attachedTo);
            console.log("t",template);
            console.log("room",Session.get('discussionToShow'));
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
    // Load variables
    //thisDiscussionID = this.data._id;
    //console.log("JU", Projects.findOne({ 'discussions': {'$in': [this.data._id]} }) );
    //thisProjectID2 = Projects.findOne({ 'discussions': thisDiscussionID }).projectId;
    // Set variables
    //Session.set('thisProject', thisProjectID);
    //console.log("ap",thisProjectID2);
});

Template.DiscussionButtons.onRendered(function () {
});

Template.DiscussionButtons.onDestroyed(function () {
});

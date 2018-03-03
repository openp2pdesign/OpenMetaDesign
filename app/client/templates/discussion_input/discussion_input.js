/*****************************************************************************/
/* DiscussionInput: Event Handlers */
/*****************************************************************************/
Template.DiscussionInput.events({
});

/*****************************************************************************/
/* DiscussionInput: Helpers */
/*****************************************************************************/
Template.DiscussionInput.helpers({
    autocompleteSettingsUser: function() {
        return {
            position: "bottom",
            limit: 8,
            rules: [{
                    token: '@',
                    collection: Meteor.users,
                    field: "username",
                    template: Template.UserPill,
                    noMatchTemplate: Template.NotFoundPill
                },
            ]
        };
    },
});

/*****************************************************************************/
/* DiscussionInput: Lifecycle Hooks */
/*****************************************************************************/
Template.DiscussionInput.onCreated(function () {
});

Template.DiscussionInput.onRendered(function () {
});

Template.DiscussionInput.onDestroyed(function () {
});

/*****************************************************************************/
/* Me: Event Handlers */
/*****************************************************************************/
Template.Me.events({
    'click .edit-user': function() {
        Modal.show('MyProfileEdit', this);
    },
    'click .change-password': function() {
        Modal.show('ChangePassword', this);
    },
    'click .create-project': function(event, template) {
        event.preventDefault();
        Meteor.call('createProject', function(error, result) {
            Router.go('projectsViz', {
                _id: result
            });
        });
    }
});

/*****************************************************************************/
/* Me: Helpers */
/*****************************************************************************/
Template.Me.helpers({
    currentUserData: function() {
        return Meteor.user();
    }
});

/*****************************************************************************/
/* Me: Lifecycle Hooks */
/*****************************************************************************/
Template.Me.onCreated(function() {});

Template.Me.onRendered(function() {});

Template.Me.onDestroyed(function() {});

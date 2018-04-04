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
    'click #create-project-button': function(event, template) {
        event.preventDefault();
        Meteor.call('createProject', function(error, result) {
            if (error) {
                var errorNotice = new PNotify({
                    type: 'error',
                    title: 'Error',
                    text: 'There was an error in creating the project',
                    icon: 'fa fa-cube',
                    addclass: 'pnotify stack-topright',
                    animate: {
                        animate: true,
                        in_class: 'slideInDown',
                        out_class: 'slideOutUp'
                    },
                    buttons: {
                        closer: true,
                        sticker: false
                    }
                });

                errorNotice.get().click(function() {
                    errorNotice.remove();
                });
            } else {
                Router.go('projectsViz', {
                    _id: result
                });
                var successNotice = new PNotify({
                    type: 'success',
                    title: 'Success',
                    text: 'Project successfully created.',
                    icon: 'fa fa-cube',
                    addclass: 'pnotify stack-topright',
                    animate: {
                        animate: true,
                        in_class: 'slideInDown',
                        out_class: 'slideOutUp'
                    },
                    buttons: {
                        closer: true,
                        sticker: false
                    }
                });

                successNotice.get().click(function() {
                    successNotice.remove();
                });
            }

        });
    }
});

/*****************************************************************************/
/* Me: Helpers */
/*****************************************************************************/
Template.Me.helpers({
    currentUserData: function() {
        return Meteor.user();
    },
    myProjectsSelector: function() {
        var user = Meteor.user();
        if (user) {
            return { 'users.$.id': Meteor.user()._id };
        }
    }
});

/*****************************************************************************/
/* Me: Lifecycle Hooks */
/*****************************************************************************/
Template.Me.onCreated(function() {});

Template.Me.onRendered(function() {});

Template.Me.onDestroyed(function() {});

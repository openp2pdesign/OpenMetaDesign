Template.MasterLayout.helpers({});

Template.MasterLayout.events({
    'click #signout': function(event) {
        event.preventDefault();
        Meteor.logout(function() {
            Router.go('/');
        });
    }
});

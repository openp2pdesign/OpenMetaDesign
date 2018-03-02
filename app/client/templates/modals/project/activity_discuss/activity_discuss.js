/*****************************************************************************/
/* ActivityDiscuss: Event Handlers */
/*****************************************************************************/
Template.ActivityDiscuss.events({
});

/*****************************************************************************/
/* ActivityDiscuss: Helpers */
/*****************************************************************************/
Template.ActivityDiscuss.helpers({
    data: function() {
        // Return helper values for the template
        return {
            "project": thisProject,
            "process": this.process,
            "activity": thisActivity
        }
    },
    thisUsername: function() {
        return Meteor.user().username;
    },
    thisName: function() {
        var name = Meteor.user().profile.firstName + ' ' + Meteor.user().profile.lastName;
        return name;
    },
    thisGravatar: function() {
        var url = Gravatar.imageUrl(Meteor.user().emails[0].address, {
            size: 34,
            default: 'mm'
        });
        return url;
    }
});

/*****************************************************************************/
/* ActivityDiscuss: Lifecycle Hooks */
/*****************************************************************************/
Template.ActivityDiscuss.onCreated(function () {
});

Template.ActivityDiscuss.onRendered(function () {
});

Template.ActivityDiscuss.onDestroyed(function () {
});

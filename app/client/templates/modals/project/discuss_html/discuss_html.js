/*****************************************************************************/
/* DiscussHtml: Event Handlers */
/*****************************************************************************/
Template.DiscussHtml.events({
});

/*****************************************************************************/
/* DiscussHtml: Helpers */
/*****************************************************************************/
Template.DiscussHtml.helpers({
    thisField: function() {
        return this.field;
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
        var url = Gravatar.imageUrl(Meteor.user().emails[0].address, {
            size: 34,
            default: 'mm'
        });
        return url;
    },
});

/*****************************************************************************/
/* DiscussHtml: Lifecycle Hooks */
/*****************************************************************************/
Template.DiscussHtml.onCreated(function () {
});

Template.DiscussHtml.onRendered(function () {
});

Template.DiscussHtml.onDestroyed(function () {
});

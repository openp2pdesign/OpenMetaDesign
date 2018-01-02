/*****************************************************************************/
/* Authorize: Event Handlers */
/*****************************************************************************/
Template.Authorize.events({
});

/*****************************************************************************/
/* Authorize: Helpers */
/*****************************************************************************/
Template.Authorize.helpers({
    // Get the login token to pass to oauth
    // This is the best way to identify the logged user
    getToken: function() {
      return localStorage.getItem('Meteor.loginToken');
    }
});

/*****************************************************************************/
/* Authorize: Lifecycle Hooks */
/*****************************************************************************/
Template.Authorize.onCreated(function () {
    // Subscribe the list of already authorized clients
    // to auto accept
    this.subscribe('authorizedOAuth');
});

Template.Authorize.onRendered(function () {
    // Auto click the submit/accept button if user already
    // accepted this client
    var data = this.data;
    this.autorun(function(c) {
      var user = Meteor.user();
      if (user && user.oauth && user.oauth.authorizedClients && user.oauth.authorizedClients.indexOf(data.client_id()) > -1) {
        c.stop();
        $('button').click();
      }
    });
});

Template.Authorize.onDestroyed(function () {
});

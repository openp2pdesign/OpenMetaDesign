var oauth2server = new OAuth2Server({
  // You can change the collection names, the values
  // below are the default values.
  accessTokensCollectionName: 'oauth_access_tokens',
  refreshTokensCollectionName: 'oauth_refresh_tokens',
  clientsCollectionName: 'oauth_clients',
  authCodesCollectionName: 'oauth_auth_codes',
  // You can pass the collection object too
  // accessTokensCollection: new Meteor.Collection('custom_oauth_access_tokens'),
  // refreshTokensCollection: new Meteor.Collection('custom_oauth_refresh_tokens'),
  // clientsCollection: new Meteor.Collection('custom_oauth_clients'),
  // authCodesCollection: new Meteor.Collection('custom_oauth_auth_codes'),
  // You can enable some logs too
  debug: true
});

// Add the express routes of OAuth before the Meteor routes
WebApp.rawConnectHandlers.use(oauth2server.app);

// Add a route to return account information
oauth2server.routes.get('/account', oauth2server.oauth.authorise(), function(req, res, next) {
  var user = Meteor.users.findOne(req.user.id);

  res.send({
    id: user._id,
    name: user.name
  });
});

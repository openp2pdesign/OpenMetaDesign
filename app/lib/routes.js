Router.configure({
    layoutTemplate: 'MasterLayout',
    loadingTemplate: 'Loading',
    notFoundTemplate: 'NotFound'
});

// Router.route('projects/list', {
//   name: 'projectsList',
//   controller: 'ListController',
//   where: 'client'
// });
//
// Router.route('projects/design', {
//   name: 'projectsDesign',
//   controller: 'DesignController',
//   where: 'client'
// });


// Home page
Router.route('home', {
    name: 'home',
    controller: 'HomeController',
    where: 'client'
});

// Admin section
Router.route('admin', {
    name: 'admin',
    controller: 'AdminController',
    where: 'client'
});

// User profile
Router.route('me', {
    name: 'user',
    waitOn: function() {
        return Meteor.subscribe("userData");
    },
    data: function() { return Meteor.users.findOne(); },
    controller: 'UserController',
    where: 'client'
});

// SignIn
AccountsTemplates.configureRoute('signIn', {
    name: 'Login',
    path: '/login',
    template: 'Login',
    layoutTemplate: 'MasterLayout',
    redirect: function() {
        var user = Meteor.user();
        if (user)
            Router.go('user');
    }
});

// SignOut
Router.route('signOut', {
    name: 'Logout',
    path: '/logout',
    onBeforeAction: Meteor.logout
});

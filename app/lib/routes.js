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




Router.route('home', {
    name: 'home',
    controller: 'HomeController',
    where: 'client'
});


Router.route('users', {
    name: 'users',
    controller: 'UsersController',
    where: 'client'
});

AccountsTemplates.configureRoute('signIn', {
    name: 'Login',
    path: '/login',
    template: 'Login',
    layoutTemplate: 'MasterLayout',
    redirect: function() {
        var user = Meteor.user();
        if (user)
            Router.go('/user/' + user._id);
    }
});

Router.route('signOut', {
    name: 'Logout',
    path: '/logout',
    onBeforeAction: Meteor.logout
});

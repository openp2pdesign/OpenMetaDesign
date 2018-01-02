import { Projects } from './collections/projects.js'

Router.configure({
    layoutTemplate: 'MasterLayout',
    loadingTemplate: 'Loading',
    notFoundTemplate: 'NotFound'
});

Router.route('projects/list', {
    name: 'projectsList',
    controller: 'ListController',
    where: 'client'
});

Router.route('projects/edit', {
    name: 'projectsVizEdit',
    controller: 'VizController',
    where: 'client'
});

Router.route('projects/:_id', {
    name: 'projectsViz',
    controller: 'VizController',
    data: function(){
        return Projects.findOne({ _id: this.params._id });
    },
    where: 'client'
});


// Home page
Router.route('/', {
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
    name: 'me',
    controller: 'MeController',
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
            Router.go('me');
    }
});

// OAuth2Server

// Define the route to render the popup view
Router.route('authorize', {
    name: 'authorize',
    path: '/oauth',
    where: 'client',
    redirect: function(params, queryParams) {
        BlazeLayout.render('authorize', queryParams);
    }
});

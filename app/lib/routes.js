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

/*****************************************************************************/
/* ProjectsDesign: Event Handlers */
/*****************************************************************************/
Template.ProjectsDesign.events({});

/*****************************************************************************/
/* ProjectsDesign: Helpers */
/*****************************************************************************/
Template.ProjectsDesign.helpers({});

/*****************************************************************************/
/* ProjectsDesign: Lifecycle Hooks */
/*****************************************************************************/
Template.ProjectsDesign.onCreated(function() {

    // Access settings
    // Subscriptions take time, so check when it's ready
    self.subscription = Meteor.subscribe('settings');
    Tracker.autorun(function() {
        if (self.subscription.ready()) {
            var myset = Settings.findOne();
            GoogleMaps.load({
                key: myset.GoogleMapsAPIkey,
                libraries: 'places'
            });
        }
    });

});

Template.ProjectsDesign.onRendered(function() {});

Template.ProjectsDesign.onDestroyed(function() {});

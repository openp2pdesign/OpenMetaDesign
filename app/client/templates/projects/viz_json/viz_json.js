// Import collections
import { Projects } from '../../../../lib/collections/projects.js';
/*****************************************************************************/
/* VizJson: Event Handlers */
/*****************************************************************************/
Template.VizJson.events({
});

/*****************************************************************************/
/* VizJson: Helpers */
/*****************************************************************************/
Template.VizJson.helpers({
    jsoncode: function() {
        var data = Projects.findOne({
            '_id': thisProject._id
        });
        return JSON.stringify(data, null, '\t');
    },
});

/*****************************************************************************/
/* VizJson: Lifecycle Hooks */
/*****************************************************************************/
Template.VizJson.onCreated(function () {
    // Access this specific project
    self.subscription = Meteor.subscribe('projects');
    thisProject = this.data;
});

Template.VizJson.onRendered(function () {
});

Template.VizJson.onDestroyed(function () {
});

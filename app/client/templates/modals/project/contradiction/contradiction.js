// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";
// jquery
import { $ } from 'meteor/jquery';
// Random id
import { Random } from 'meteor/random';
// Load Projects and Settings
import { Projects } from '../../../../../lib/collections/projects.js';
import { Settings } from '../../../../../lib/collections/settings.js';
import { Activities } from '../../../../../lib/collections/activities.js';
import { ActivityElements } from '../../../../../lib/collections/activity_elements.js';
import { Contradictions } from '../../../../../lib/collections/contradictions.js';

// Client only collection for the autocomplete
LocalActivityElements = new Mongo.Collection(null);

/*****************************************************************************/
/* Contradiction: Event Handlers */
/*****************************************************************************/
Template.Contradiction.events({
});

/*****************************************************************************/
/* Contradiction: Helpers */
/*****************************************************************************/
Template.Contradiction.helpers({
});

/*****************************************************************************/
/* Contradiction: Lifecycle Hooks */
/*****************************************************************************/
Template.Contradiction.onCreated(function () {
});

Template.Contradiction.onRendered(function () {
    // Add tooltip to the tabs
    $('[data-toggle="tab"]').tooltip({
        trigger: 'hover',
        placement: 'top'
    });
});

Template.Contradiction.onDestroyed(function () {
});

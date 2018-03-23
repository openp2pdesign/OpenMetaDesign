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
import { Flows } from '../../../../../lib/collections/flows.js';

/*****************************************************************************/
/* Flow: Event Handlers */
/*****************************************************************************/
Template.Flow.events({
});

/*****************************************************************************/
/* Flow: Helpers */
/*****************************************************************************/
Template.Flow.helpers({
});

/*****************************************************************************/
/* Flow: Lifecycle Hooks */
/*****************************************************************************/
Template.Flow.onCreated(function () {
});

Template.Flow.onRendered(function () {
    // Add tooltip to the tabs
    $('[data-toggle="tab"]').tooltip({
        trigger: 'hover',
        placement: 'top'
    });
});

Template.Flow.onDestroyed(function () {
});

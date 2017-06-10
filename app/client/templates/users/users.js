s/*****************************************************************************/
/* Users: Event Handlers */
/*****************************************************************************/
Template.Users.events({});

/*****************************************************************************/
/* Users: Helpers */
/*****************************************************************************/
Template.Users.helpers({});

/*****************************************************************************/
/* Users: Lifecycle Hooks */
/*****************************************************************************/
Template.Users.onCreated(function() {});

Template.Users.onRendered(function() {});

Template.Users.onDestroyed(function() {});

// Setup of tabular for this template
import { $ } from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
dataTablesBootstrap(window, $);

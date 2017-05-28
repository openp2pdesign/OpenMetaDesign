/*****************************************************************************/
/* Users: Event Handlers */
/*****************************************************************************/
Template.Users.events({});

/*****************************************************************************/
/* Users: Helpers */
/*****************************************************************************/
Template.Users.helpers({
    users: function() {
        return Meteor.users.find();
    }
});

/*****************************************************************************/
/* Users: Lifecycle Hooks */
/*****************************************************************************/
Template.Users.onCreated(function() {
    Meteor.subscribe('usersList');
});

Template.Users.onRendered(function() {});

Template.Users.onDestroyed(function() {});


import Tabular from 'meteor/aldeed:tabular';
import {
    Template
} from 'meteor/templating';
//import moment from 'moment';
import {
    Meteor
} from 'meteor/meteor';
//import { Books } from './collections/Books';
new Tabular.Table({
    name: "Users",
    collection: Meteor.users,
    columns: [{
        data: "username",
        title: "Username"
    }],
    responsive: true,
    autoWidth: false
});

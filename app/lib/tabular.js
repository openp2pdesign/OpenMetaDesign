import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';
import { Meteor } from 'meteor/meteor';
import { Projects } from './collections/projects.js'

export const TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

// Table of users
TabularTables.Users = new Tabular.Table({
    name: "Users",
    collection: Meteor.users,
    pub: "tabular_users",
    columns: [{
        data: "username",
        title: '<i class="fa fa-id-card" aria-hidden="true"></i> Username'
    }, {
        data: "emails.[0].address",
        title: '<i class="fa fa-id-card" aria-hidden="true"></i> E-mail'
    }, {
        data: "profile.firstName",
        title: '<i class="fa fa-id-card" aria-hidden="true"></i> Name'
    }, {
        data: "profile.lastName",
        title: '<i class="fa fa-id-card" aria-hidden="true"></i> Surname'
    }, {
        data: "profile.bio",
        title: '<i class="fa fa-id-card" aria-hidden="true"></i> Bio'
    }, {
        data: "roles",
        title: '<i class="fa fa-id-card" aria-hidden="true"></i> Roles'
    }, {
        title: "Actions",
        tmpl: Meteor.isClient && Template.EditUser
    }],
    responsive: true,
    autoWidth: false
});

// Table of projects
TabularTables.Projects = new Tabular.Table({
    name: "Projects",
    collection: Projects,
    pub: "projects",
    columns: [{
        data: "_id",
        title: '<i class="fa fa-key" aria-hidden="true"></i> ID'
    }, {
        data: "title",
        title: '<i class="fa fa-header" aria-hidden="true"></i> Title'
    }, {
        data: "createdBy",
        title: '<i class="fa fa-header" aria-hidden="true"></i> Created by'
    }, {
        data: "createdAt",
        title: '<i class="fa fa-clock-o" aria-hidden="true"></i> Created at',
        render: function(val, type, doc) {
            if (val instanceof Date) {
                return moment(val).calendar() + " -- " + val;
            } else {
                return "Never";
            }
        }
    }, {
        title: "Actions",
        tmpl: Meteor.isClient && Template.EditProject
    }],
    responsive: true,
    autoWidth: false
});

// Table of flows of an activity
TabularTables.Flows = new Tabular.Table({
    name: "Flows",
    collection: Projects,
    pub: "projects",
    columns: [{
        data: "_id",
        title: '<i class="fa fa-key" aria-hidden="true"></i> ID'
    }, {
        data: "title",
        title: '<i class="fa fa-header" aria-hidden="true"></i> Title'
    }, {
        data: "createdBy",
        title: '<i class="fa fa-header" aria-hidden="true"></i> Created by'
    }, {
        data: "createdAt",
        title: '<i class="fa fa-clock-o" aria-hidden="true"></i> Created at',
        render: function(val, type, doc) {
            if (val instanceof Date) {
                return moment(val).calendar() + " -- " + val;
            } else {
                return "Never";
            }
        }
    }, {
        title: "Actions",
        tmpl: Meteor.isClient && Template.EditProject
    }],
    responsive: true,
    autoWidth: false
});

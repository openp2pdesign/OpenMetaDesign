import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';
import { Meteor } from 'meteor/meteor';
import { Projects } from './collections/projects.js'

export const TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.Users = new Tabular.Table({
    name: "Users",
    collection: Meteor.users,
    pub: "tabular_users",
    columns: [{
        data: "username",
        title: "Username"
    }, {
        data: "emails.[0].address",
        title: "E-mail"
    }, {
        data: "profile.firstName",
        title: "Name"
    }, {
        data: "profile.lastName",
        title: "Surname"
    }, {
        data: "profile.bio",
        title: "Bio"
    }, {
        data: "roles",
        title: "Role"
    }, {
        title: "Actions",
        tmpl: Meteor.isClient && Template.EditUser
    }],
    responsive: true,
    autoWidth: false
});

TabularTables.Projects = new Tabular.Table({
    name: "Projects",
    collection: Projects,
    pub: "projects",
    columns: [{
        data: "_id",
        title: "ID"
    }, {
        data: "title",
        title: "Title"
    }, {
        data: "createdBy",
        title: "Created by"
    }, {
        data: "createdAt",
        title: "Created at"
    }, {
        data: "createdAt",
        title: "... time ago",
        render: function(val, type, doc) {
            if (val instanceof Date) {
                return moment(val).calendar();
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

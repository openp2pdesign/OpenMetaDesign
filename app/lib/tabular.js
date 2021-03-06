import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';
import { Meteor } from 'meteor/meteor';
import { Projects } from './collections/projects.js'
import { Activities } from './collections/activities.js'
import { Flows } from './collections/flows.js'
import { Contradictions } from './collections/contradictions.js'
import { Discussions} from './collections/discussions.js'

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
        title: '<i class="fa fa-envelope" aria-hidden="true"></i> E-mail'
    }, {
        data: "profile.firstName",
        title: '<i class="fa fa-user" aria-hidden="true"></i> Name'
    }, {
        data: "profile.lastName",
        title: '<i class="fa fa-user" aria-hidden="true"></i> Surname'
    }, {
        data: "profile.bio",
        title: '<i class="fa fa-user-circle-o" aria-hidden="true"></i> Bio'
    }, {
        data: "roles",
        title: '<i class="fa fa-graduation-cap" aria-hidden="true"></i> Roles'
    }, {
        title: "Actions",
        tmpl: Meteor.isClient && Template.EditUser
    }],
    responsive: true,
    autoWidth: false
});

// Table of projects
TabularTables.Projects = new Tabular.Table({
    name: "MyProjects",
    collection: Projects,
    pub: "projects",
    columns: [{
        data: "_id",
        title: '<i class="fa fa-file" aria-hidden="true"></i> ID'
    }, {
        data: "title",
        title: '<i class="fa fa-book" aria-hidden="true"></i> Title'
    }, {
        data: "createdBy",
        title: '<i class="fa fa-user" aria-hidden="true"></i> Created by'
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
        title: '<i class="fa fa-tasks" aria-hidden="true"></i> Actions',
        tmpl: Meteor.isClient && Template.EditProject
    }],
    responsive: true,
    autoWidth: false
});


// Table of invited projects
TabularTables.InvitedProjects = new Tabular.Table({
    name: "InvitedProjects",
    collection: Projects,
    pub: "projects",
    columns: [{
        data: "_id",
        title: '<i class="fa fa-file" aria-hidden="true"></i> ID'
    }, {
        data: "title",
        title: '<i class="fa fa-book" aria-hidden="true"></i> Title'
    }, {
        data: "createdBy",
        title: '<i class="fa fa-user" aria-hidden="true"></i> Created by'
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
        title: '<i class="fa fa-tasks" aria-hidden="true"></i> Actions',
        tmpl: Meteor.isClient && Template.JoinProject
    }],
    responsive: true,
    autoWidth: false
});


// Table of activities
TabularTables.Activities = new Tabular.Table({
    name: "Activities",
    collection: Activities,
    pub: "tabular_activities",
    columns: [{
        data: "_id",
        title: '<i class="fa fa-file" aria-hidden="true"></i> ID'
    }, {
        data: "activityData.number",
        title: '<i class="fa fa-list-ol" aria-hidden="true"></i> #'
    }, {
        data: "activityData.title",
        title: '<i class="fa fa-book" aria-hidden="true"></i> Title'
    }, {
        data: "createdBy",
        title: '<i class="fa fa-user" aria-hidden="true"></i> Created by'
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
        title: '<i class="fa fa-tasks" aria-hidden="true"></i> Actions',
        tmpl: Meteor.isClient && Template.ActivitiesButtons
    }],
    responsive: true,
    autoWidth: false
});


// Table of flows
TabularTables.Flows = new Tabular.Table({
    name: "Flows",
    collection: Flows,
    pub: "tabular_flows",
    columns: [{
        data: "_id",
        title: '<i class="fa fa-file" aria-hidden="true"></i> ID'
    }, {
        data: "flowData.title",
        title: '<i class="fa fa-book" aria-hidden="true"></i> Title'
    }, {
        data: "createdBy",
        title: '<i class="fa fa-user" aria-hidden="true"></i> Created by'
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
        title: '<i class="fa fa-tasks" aria-hidden="true"></i> Actions',
        tmpl: Meteor.isClient && Template.FlowButtons
    }],
    responsive: true,
    autoWidth: false
});


// Table of contradictions
TabularTables.Contradictions = new Tabular.Table({
    name: "Contradictions",
    collection: Contradictions,
    pub: "tabular_contradictions",
    columns: [{
        data: "_id",
        title: '<i class="fa fa-file" aria-hidden="true"></i> ID'
    }, {
        data: "contradictionData.title",
        title: '<i class="fa fa-book" aria-hidden="true"></i> Title'
    }, {
        data: "createdBy",
        title: '<i class="fa fa-user" aria-hidden="true"></i> Created by'
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
        title: '<i class="fa fa-tasks" aria-hidden="true"></i> Actions',
        tmpl: Meteor.isClient && Template.ContradictionButtons
    }],
    responsive: true,
    autoWidth: false
});

// Table of discussions
TabularTables.Discussions = new Tabular.Table({
    name: "Discussions",
    collection: Discussions,
    pub: "tabular_discussions",
    extraFields: ['icon'],
    columnDefs: [{
        "targets": 2,
        "className": "text-center",
        "width": "50px"
    }],
    columns: [{
        data: "_id",
        title: '<i class="fa fa-file" aria-hidden="true"></i> ID'
    }, {
        data: "attachedToDescription",
        title: '<i class="fa fa-book" aria-hidden="true"></i> Element',
        render: function(val, type, doc) {
            return '<i class="'+doc.icon+'"></i> '+val;
        }
    }, {
        data: "numberOfComments",
        title: '<i class="fa fa-comments" aria-hidden="true"></i>',
        render: function(val, type, doc) {
            return '<span class="badge">'+val+'</span>';
        }
    }, {
        data: "createdBy",
        title: '<i class="fa fa-user" aria-hidden="true"></i> Created by'
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
        title: '<i class="fa fa-tasks" aria-hidden="true"></i> Actions',
        tmpl: Meteor.isClient && Template.DiscussionButtons
    }],
    responsive: true,
    autoWidth: false
});

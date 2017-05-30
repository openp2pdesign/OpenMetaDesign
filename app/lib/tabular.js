import Tabular from 'meteor/aldeed:tabular';
import {
    Template
} from 'meteor/templating';
import {
    moment
} from 'meteor/momentjs:moment';
import {
    Meteor
} from 'meteor/meteor';

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
        title: "Actions",
        tmpl: Meteor.isClient && Template.editUser
    }],
    responsive: true,
    autoWidth: false
});

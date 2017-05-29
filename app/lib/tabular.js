import Tabular from 'meteor/aldeed:tabular';
import {
    Template
} from 'meteor/templating';
//import moment from 'moment';
import {
    moment
} from 'meteor/momentjs:moment';
import {
    Meteor
} from 'meteor/meteor';
//import { Books } from './collections/Books';

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
        data: "username",
        title: "Edit"
    }, {
        data: "username",
        title: "Delete"
    }],
    responsive: true,
    autoWidth: false
});

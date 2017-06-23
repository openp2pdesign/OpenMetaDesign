// Load Pnotify
import 'pnotify/dist/pnotify.css';
import PNotify from 'pnotify';
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.styling = "fontawesome";

var myStack = {
    "dir1": "down",
    "dir2": "right",
    "push": "top"
};


Template.MasterLayout.helpers({});

Template.MasterLayout.events({
    'click #signout': function(event) {
        event.preventDefault();
        Meteor.logout(function() {
            Router.go('/');
        });
    },
    // Just a test for Pnotify
    'click #home': function(event) {
        event.preventDefault();
        
        var notice = new PNotify({
            type: 'info',
            title: 'Title',
            text: 'Text.',
            icon: 'fa fa-envelope-o',
            addclass: 'pnotify stack-topright',
            animate: {
                animate: true,
                in_class: 'slideInDown',
                out_class: 'slideOutUp'
            },
            buttons: {
                closer: true,
                sticker: false
            }
        });
        notice.get().click(function() {
            notice.remove();
        });

    }
});

Meteor.publish('projects', function() {
    return Projects.find();
});


Meteor.publish('usersList', function() {
    return Meteor.users.find({}, {fields:{emails:1}});
});

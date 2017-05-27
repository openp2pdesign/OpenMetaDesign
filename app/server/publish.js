Meteor.publish('projects', function() {
    return Projects.find();
});


Meteor.publish('usersList', function() {
    return Meteor.users.find({}, {
        fields: {
            'emails': 1,
            'username': 1,
            'profile.firstName': 1,
            'profile.lastName': 1,
            'profile.bio': 1
        }
    });
});

// Manage roles

// Choose roles for new users
newUserRole = function(userId, info) {
    if (Meteor.users.find().count() === 1) {
        // First user is admin
        Roles.addUsersToRoles(userId, 'admin');
    } else {
        // Everybody else is admin
        Roles.addUsersToRoles(userId, 'default');
    }
};

// Configure the hook for new users
AccountsTemplates.configure({
    // Hooks
    postSignUpHook: newUserRole,
});

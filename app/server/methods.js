/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

Meteor.methods({
    'server/method_name': function() {
        // server method logic
    },
    'removeAdmin': function(userId) {
        Roles.removeUsersFromRoles(userId, 'admin');
    },
    'addAdmin': function(userId) {
        Roles.addUsersToRoles(userId, 'admin');
    }
});

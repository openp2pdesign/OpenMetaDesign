/*****************************************************************************/
/*  Client and Server Methods */
/*****************************************************************************/

Meteor.methods({
    "userExists": function(username){
              return !!Meteor.users.findOne({username: username});
          },

});

AccountsTemplates.addFields([{
    _id: 'username',
    type: 'text',
    displayName: "Username",
    required: true,
    func: function(value) {
        if (Meteor.isClient) {
            var self = this;
            Meteor.call("userExists", value, function(err, userExists) {
                if (!userExists)
                    self.setSuccess();
                else
                    self.setError(userExists);
                self.setValidating(false);
            });
            return;
        }
        // Server
        if (Meteor.isServer) {
            return Meteor.call("userExists", value);
        }
    }
}, {
    _id: 'firstName',
    type: 'text',
    displayName: "Name",
    required: true
}, {
    _id: 'lastName',
    type: 'text',
    displayName: "Surname",
    required: true
}, {
    _id: 'bio',
    type: 'text',
    displayName: "Bio"
}]);


AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,
    lowercaseUsername: true,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',
    termsUrl: 'http://www.google.com',

    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 4000,

    // Texts
    texts: {
        button: {
            signUp: "Register Now!"
        },
        socialSignUp: "Register",
        socialIcons: {
            "meteor-developer": "fa fa-rocket"
        },
        title: {
            forgotPwd: "Recover Your Password",
            signIn: "",
            signUp: ""
        },
    },
});

// Enable user editing
Meteor.users.allow({
    // Users can update only their profile, unless they are admin
    update: function(userId, doc, fieldNames, modifier) {
        return userId === Meteor.user()._id && Roles.userIsInRole(Meteor.user(), ['admin']);
    },
    // Users can delete only their profile, unless they are admin
    remove: function(userId, doc) {
        return userId === Meteor.user()._id && Roles.userIsInRole(Meteor.user(), ['admin']);
    }
});

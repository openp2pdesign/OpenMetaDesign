AccountsTemplates.addFields([{
    _id: 'name',
    type: 'text',
    displayName: "Name",
    required: true
}, {
    _id: 'surname',
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
    homeRoutePath: '/home',
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
          forgotPwd: "Recover Your Password"
      },
    },
});

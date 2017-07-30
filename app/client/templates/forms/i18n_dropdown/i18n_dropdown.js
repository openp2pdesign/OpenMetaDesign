/*****************************************************************************/
/* I18nDropdown: Event Handlers */
/*****************************************************************************/
Template.I18nDropdown.events({
    'click a': function (event) {
      event.preventDefault();

      TAPi18n.setLanguageAmplify(this.tag);
    }
});

/*****************************************************************************/
/* I18nDropdown: Helpers */
/*****************************************************************************/
Template.I18nDropdown.helpers({
});

/*****************************************************************************/
/* I18nDropdown: Lifecycle Hooks */
/*****************************************************************************/
Template.I18nDropdown.onCreated(function () {
});

Template.I18nDropdown.onRendered(function () {
});

Template.I18nDropdown.onDestroyed(function () {
});

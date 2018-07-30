// Import collections
import { Projects } from '../../../../lib/collections/projects.js';
/*****************************************************************************/
/* VizVersions: Event Handlers */
/*****************************************************************************/
Template.VizVersions.events({
});

/*****************************************************************************/
/* VizVersions: Helpers */
/*****************************************************************************/
Template.VizVersions.helpers({
    versions: function() {
        var prettifiedData = [];
        for (version in thisProject.versions) {
            if (typeof thisProject.versions[version].diff !== 'undefined') {
                var thisData = {
                    "id": thisProject.versions[version].id,
                    "number": thisProject.versions[version].number,
                    "updatedAtBy": thisProject.versions[version].updatedAtBy,
                    "updatedAt": thisProject.versions[version].updatedAt,
                    "updatedAtRelative": moment(thisProject.versions[version].updatedAt).calendar(),
                    "diff": JSON.stringify(JSON.parse(thisProject.versions[version].diff), null, '\t'),
                };
                prettifiedData.push(thisData);
            }
        }
        return prettifiedData;
    },
});

/*****************************************************************************/
/* VizVersions: Lifecycle Hooks */
/*****************************************************************************/
Template.VizVersions.onCreated(function () {
});

Template.VizVersions.onRendered(function () {
});

Template.VizVersions.onDestroyed(function () {
});

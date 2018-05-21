import LineChart from 'britecharts/dist/umd/line.min.js';
import colors from 'britecharts/dist/umd/colors.min.js';
import tooltip from 'britecharts/dist/umd/tooltip.min.js';
import 'britecharts/dist/css/britecharts.min.css';
var d3Selection = require('d3-selection');

// Load Projects and Projects Stats
import { Projects } from '../../../../lib/collections/projects.js';
import { ProjectsStats } from '../../../../lib/collections/projectsstats.js';

/*****************************************************************************/
/* ProjectActivityViz: Event Handlers */
/*****************************************************************************/
Template.ProjectActivityViz.events({});

/*****************************************************************************/
/* ProjectActivityViz: Helpers */
/*****************************************************************************/
Template.ProjectActivityViz.helpers({});

/*****************************************************************************/
/* ProjectActivityViz: Lifecycle Hooks */
/*****************************************************************************/
Template.ProjectActivityViz.onCreated(function() {
    Meteor.subscribe('projects');
    Meteor.subscribe('projectsstats');
    // Get project ID
    thisProjectID = this.data._id;
});

Template.ProjectActivityViz.onRendered(function() {

    // Initializat the chart
    let container = d3Selection.select('#js-chart-container'),
        lineChart = new LineChart(),
        chartTooltip = tooltip(),
        thisData;
    // Make the chart fit into the bootstrap columns
    let containerWidth = container.node() ? container.node().getBoundingClientRect().width : false;

    if (containerWidth) {

        // Set up the chart
        lineChart
            .isAnimated(true)
            .aspectRatio(0.5)
            .grid('horizontal')
            .tooltipThreshold(300)
            .width(containerWidth)
            .margin(0)
            .dateLabel('date')
            .valueLabel('value')
            .lineCurve('basis')
            .on('customMouseOver', chartTooltip.show)
            .on('customMouseMove', chartTooltip.update)
            .on('customMouseOut', chartTooltip.hide);

        //Tooltip Setup and start
        chartTooltip
            //.topicLabel('topicName')
            //.dateLabel('date')
            .title('Tooltip title');

        tooltipContainer = d3Selection.select('.js-single-line-chart-container .metadata-group .vertical-marker-container');
        tooltipContainer.datum([]).call(chartTooltip);
    }

    // Viz
    Tracker.autorun(function() {
        // REACTIVE VIZ
        // Reactive var for the autorun
        var thisData = ProjectsStats.findOne({
            'projectId': thisProjectID
        });
        // If there's data
        if (typeof thisData !== "undefined") {
            // Link the chart to the data
            console.log(thisData);
            container.datum(thisData).call(lineChart);
        }
    });

});

Template.ProjectActivityViz.onDestroyed(function() {});

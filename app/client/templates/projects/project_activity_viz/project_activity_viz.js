import LineChart from 'britecharts/dist/umd/line.min.js';
import colors from 'britecharts/dist/umd/colors.min.js';
import tooltip from 'britecharts/dist/umd/tooltip.min.js';
import 'britecharts/dist/css/britecharts.min.css';
var d3Selection = require('d3-selection');

// Load Projects and Projects Stats
import { Projects } from '../../../../lib/collections/projects.js';
import { ProjectStats } from '../../../../lib/collections/projectstats.js';

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
    Meteor.subscribe('projectstats');
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
    var margin = {
            left: 120,
            right: 20,
            top: 20,
            bottom: 30
        },
        tooltipContainer = void 0;
    // Setup
    if (containerWidth) {
        // Set up the chart
        lineChart
            .isAnimated(true)
            .aspectRatio(0.5)
            .tooltipThreshold(300)
            .grid('horizontal')
            .width(containerWidth)
            .margin(margin)
            .dateLabel('date')
            .valueLabel('value')
            .lineCurve('basis')
            .shouldShowAllDataPoints(true)
            //.xAxisCustomFormat(lineChart.axisTimeCombinations.HOUR_DAY)
            .xTicks(20)
            //.on('customMouseOver', chartTooltip.show)
            //.on('customMouseMove', chartTooltip.update)
            //.on('customMouseOut', chartTooltip.hide);

        //Tooltip Setup and start
        chartTooltip.title('Tooltip Title');
        tooltipContainer = d3Selection.select('#js-chart-container .metadata-group .horizontal-marker-container');
        tooltipContainer.datum([]).call(chartTooltip);
    }

    // Viz
    Tracker.autorun(function() {
        // REACTIVE VIZ
        // Reactive var for the autorun
        var thisData = ProjectStats.findOne({
            'projectId': thisProjectID
        });
        // If there's data
        if (typeof thisData !== "undefined") {
            // Link the chart to the data
            container.datum(thisData).call(lineChart);
        }
    });

});

Template.ProjectActivityViz.onDestroyed(function() {});

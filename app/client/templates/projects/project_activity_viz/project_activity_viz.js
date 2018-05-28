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
        chartTooltip = new tooltip(),
        thisData;
    // Make the chart fit into the bootstrap columns
    let containerWidth = container.node() ? container.node().getBoundingClientRect().width : false;
    var margin = {
            left: 40,
            right: 20,
            top: 20,
            bottom: 40
        },
        tooltipContainer = void 0;
    // Setup
    if (containerWidth) {
        // Set up the chart
        lineChart
            .isAnimated(true)
            .aspectRatio(0.5)
            .tooltipThreshold(300)
            .grid('full')
            .width(containerWidth)
            .margin(margin)
            .dateLabel('date')
            .valueLabel('value')
            .xAxisFormat('custom')
            .xTicks(4)
            .xAxisCustomFormat('%d-%m-%Y %H:%M')
            .lineCurve('basis')
            .shouldShowAllDataPoints(true)
            .on('customMouseOver', function() {
                chartTooltip.show();
            })
            .on('customMouseMove', function(dataPoint, topicColorMap, x,y) {
                chartTooltip.update(dataPoint, topicColorMap, x, y);
            })
            .on('customMouseOut', function() {
                chartTooltip.hide();
            });

        //Tooltip Setup and start
        chartTooltip
            //.topicLabel('value')
            //.dateLabel('date')
            .title('Tooltip Title');
        tooltipContainer = d3Selection.select('#js-chart-container .metadata-group');
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

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
    // Get the data
    thisData = ProjectsStats.findOne({
        'projectId': thisProjectID
    });
    console.log(thisData);

    // Initializat the chart
    let container = d3Selection.select('#js-chart-container'),
        lineChart = new LineChart();
    // Make the chart fit into the bootstrap columns
    let newContainerWidth = container.node() ? container.node().getBoundingClientRect().width : false;
    // Set up the chart
    if (container.node()) {
        let chartTooltip = tooltip();
        lineChart
            .isAnimated(true)
            .aspectRatio(0.5)
            .grid('horizontal')
            //.tooltipThreshold(600)
            .width(newContainerWidth)
            .margin(10)
            .dateLabel('date')
            .lineCurve('basis')
            .on('customMouseOver', chartTooltip.show)
            .on('customMouseMove', chartTooltip.update)
            .on('customMouseOut', chartTooltip.hide)
            .on('customDataEntryClick', function(d, mousePosition) {
                // eslint-disable-next-line no-console
                console.log('Data entry marker clicked', d, mousePosition);
            })
    }
    // This line gets together container, data and chart
    container.datum(thisData).call(lineChart);
});

Template.ProjectActivityViz.onDestroyed(function() {});

import LineChart from 'britecharts/dist/umd/line.min.js';
import colors from 'britecharts/dist/umd/colors.min.js';
import tooltip from 'britecharts/dist/umd/tooltip.min.js';
import 'britecharts/dist/css/britecharts.min.css';
var d3Selection = require('d3-selection');

/*****************************************************************************/
/* ProjectActivityViz: Event Handlers */
/*****************************************************************************/
Template.ProjectActivityViz.events({
});

/*****************************************************************************/
/* ProjectActivityViz: Helpers */
/*****************************************************************************/
Template.ProjectActivityViz.helpers({
});

/*****************************************************************************/
/* ProjectActivityViz: Lifecycle Hooks */
/*****************************************************************************/
Template.ProjectActivityViz.onCreated(function () {
});

Template.ProjectActivityViz.onRendered(function () {
    var data = {
  "dataByTopic": [
    {
      "topic": 103,
      "dates": [
            {
              "date": "27-Jun-15",
              "value": 1,
              "fullDate": "2015-06-27T07:00:00.000Z"
            },
      ],
      "topicName": "Edits"
    },
    {
      "topic": 60,
      "dates": [
        {
          "date": "27-Jun-15",
          "value": 0,
          "fullDate": "2015-06-27T07:00:00.000Z"
        },
      ],
      "topicName": "Comments"
    },
  ]
};
    var container = d3Selection.select('#js-chart-container'),
      lineChart = new LineChart();
      if (container.node()) {
          let chartTooltip = tooltip();
          lineChart
              .isAnimated(true)
            .aspectRatio(0.5)
            .grid('horizontal')
            .tooltipThreshold(600)
            .width(800)
            .margin(10)
            .dateLabel('fullDate')
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
      container.datum(data).call(lineChart);
});

Template.ProjectActivityViz.onDestroyed(function () {
});

import d3 from 'd3';

import {
    TextBox
} from 'd3plus-text';

export default function openmetadesign_viz(data) {

    // The container for the viz
    var d3Container = document.getElementById("d3-container");

    // Margins
    // https://bl.ocks.org/mbostock/3019563
    var margin = {
        top: 15,
        right: 10,
        bottom: 10,
        left: 10
    };
    var gutter = 10;

    // Get dimensions of the container on window resize
    window.addEventListener("resize", function(d) {
        width = d3Container.clientWidth;
        height = d3Container.clientHeight;
        console.log(width, height);
    });

    // Add the SVG to the container
    var svg = d3.select('#d3-container').append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Functions for reusable elements
    // Create a button with a FontAwesome icon
    var addButton = function(x, y, radius, parent, iconCode) {

        var button = parent.append("g");

        // Add the circle
        button.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", radius);

        // Add the icon
        button.append('text')
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .style("font-family", "FontAwesome")
            .style("font-size", radius.toString() + "px")
            .text(iconCode);

        // Add classes
        button.attr("class", "svg-button")
            .on("mouseover", function() {
                d3.select(this)
                    .attr("filter", "url(#glow)");
            })
            .on("mouseout", function() {
                d3.select(this)
                    .attr("filter", null);
            })

        return button;

    }

    // Create an activity
    var addActivity = function(x, y, parent) {

        // Dimensions
        var participationContainerWidth = 30;
        var mainContainerWidth = 170;

        var activity = parent.append("g");

        // Add the participation container
        var participationContainer = activity.append("g").attr("class", "svg-activity-participation");

        participationContainer.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", participationContainerWidth)
            .attr("height", 600);

        // Add the main container
        var mainContainer = activity.append("g").attr("class", "svg-activity");

        mainContainer.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", mainContainerWidth)
            .attr("height", 600);

        // Move the main container beside the participation container
        var mainContainerX = participationContainerWidth + 5;
        mainContainer.attr("transform", "translate(" + mainContainerX + ",0)");

        // Add the title with a D3Plus TextBox
        var activityTitle = mainContainer.append('g')
            .attr("id", "textbox-1");

        title = new TextBox()
            .data([{}])
            .select("#textbox-1")
            .text("Activity Title")
            .width(mainContainerWidth - 70)
            .x(x + 10)
            .y(y + 20)
            .fontSize(16)
            .fontWeight(500)
            .render();

        // Add the control buttons
        var activityButtons = mainContainer.append("g");
        // Discuss Button
        var discussButton = addButton(x + 5, y, 10, activityButtons, '\uf086');
        discussButton.attr("data-toggle", "modal")
            .classed("discuss-button", true);
        // Edit Button
        var editButton = addButton(x + 30, y, 10, activityButtons, '\uf044');
        editButton.attr("data-toggle", "modal")
            .classed("edit-button", true);
        // Flows Button
        var flowsButton = addButton(x + 55, y, 10, activityButtons, '\uf074');
        flowsButton.attr("data-toggle", "modal")
            .classed("flows-button", true);
        // Issues Button
        var issuesButton = addButton(x + 80, y, 10, activityButtons, '\uf071');
        issuesButton.attr("data-toggle", "modal")
            .classed("issues-button", true);
        // Delete Button
        var deleteButton = addButton(x + 105, y, 10, activityButtons, '\uf068');
        deleteButton.attr("data-toggle", "modal")
            .classed("delete-button", true);
        // Move the buttons below the title
        activityButtonY = 15 + // padding
            20 + // button size
            parseInt(activityTitle.node().getBBox().height); // title height
        activityButtons.attr("transform", "translate(15," + activityButtonY + ")");

        // Add the description with a D3Plus TextBox
        var activityDescription = mainContainer.append('g')
            .attr("id", "textbox-2");

        description = new TextBox()
            .data([{}])
            .text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed turpis at dolor porta malesuada. Mauris sollicitudin mi lorem, eu imperdiet risus fermentum vitae. Suspendisse in velit in felis semper vestibulum non eget nunc. Aliquam ultricies, mauris a rutrum aliquet, justo ante varius odio, at consequat tortor sapien porttitor nisl.")
            .width(mainContainerWidth - 30)
            .select("#textbox-2")
            .x(x + 10)
            .y(y + activityButtonY + 20)
            .fontSize(14)
            .fontWeight(400)
            .render();

        // Add emojis
        var activityEmojis = mainContainer.append("g");
        var activityDescription = activityEmojis.append('foreignObject')
            .attr("x", x)
            .attr("y", y + activityButtonY + 30)
            .attr("width", mainContainerWidth)
            .append('xhtml:p')
            .html("emojis")
            .attr("class", "svg-activity-emojis");
        activityEmojisY = activityButtonY + // previous space
            20 + // button size
            parseInt(activityDescription.style("height")); // description height
        console.log(activityEmojisY);
        activityEmojis.attr("transform", "translate(0," + activityEmojisY + ")")

        // Return the whole activity
        return activity;

    }

    // Filters
    var defs = svg.append("defs");
    // Glow filter
    var glow = defs.append("filter")
        .attr("id", "glow");
    glow.append("feGaussianBlur")
        .attr("stdDeviation", "1.5")
        .attr("result", "coloredBlur");
    var feMerge = glow.append("feMerge");
    feMerge.append("feMergeNode")
        .attr("in", "coloredBlur");
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    // Draw everything

    // Layout initialization
    var timeG = svg.append("g");
    var journeyG = svg.append("g");
    var blueprintG = svg.append("g");

    // Debug: see the border of each group
    svg.attr("style", "outline: thin solid black;");
    timeG.attr("style", "outline: thin solid green;");
    journeyG.attr("style", "outline: thin solid red;");
    blueprintG.attr("style", "outline: thin solid blue;");

    // Draw the Time section
    var yScale = d3.scaleTime()
        .domain([new Date(2000, 0, 1), new Date(2001, 0, 11)])
        .range([0, 800]);
    yAxis = d3.axisLeft().scale(yScale)
        .ticks(16)
        .tickSize(10);
    timeG.attr("id", "yAxisG")
        .call(yAxis);

    // Draw the Journey section
    journeyG.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 100)
        .attr("height", 20)
        .attr("fill", "orange");

    // Create a sample button
    var button2 = addButton(20, 120, 20, journeyG, '\uf06e');
    // Make it open a modal
    button2.attr("data-toggle", "modal");
    // Add its functioning on click
    button2.on("click", function() {
        blueprintG.transition()
            .duration(500)
            .attr("transform", "scale(0.2,1)");
    });

    // Draw the Blueprint section
    blueprintG.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 340)
        .attr("height", 50)
        .attr("fill", "red");

    // Create a sample activity
    var activity2 = addActivity(20, 120, blueprintG);

    // Layout: organize sections
    // In case we need to get the transform of an element: https://stackoverflow.com/a/38753017/2237113
    // Translate timeG according to the label width
    var timeGX = timeG.node().getBBox().width;
    timeG.attr("transform", "translate(" + timeGX + "," + 0 + ")");
    // Translate journeyG it after the timeG section
    var journeyGX = timeGX + timeG.node().getBBox().x + timeG.node().getBBox().width + gutter;
    journeyG.attr("transform", "translate(" + journeyGX + "," + 0 + ")");
    // Translate blueprintG after the journeyG section
    var blueprintGX = journeyGX + journeyG.node().getBBox().width + gutter;
    blueprintG.attr("transform", "translate(" + blueprintGX + "," + 0 + ")");

}

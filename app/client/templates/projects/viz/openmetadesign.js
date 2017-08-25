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
    var labelHeight = 20;

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

    // Emojis for reactions
    // Source: https://github.com/twitter/twemoji
    // License: CC-BY

    var emojis = {
        simple_smile: "",
        heart_eyes: '',
        worried: "",
        angry: "",
        up: "",
        down: ""
    }

    emojis.worried = "";
    emojis.angry = "";
    emojis.up = "";
    emojis.down = "";

    // Functions for reusable elements

    // Load a svg file and append it to a parent element
    var loadSVG = function(url, parent, x, y, scale) {

        var loadedSVG = parent.append("g");

        d3.xml(url, function(xml) {
            var svgFile = document.importNode(xml.documentElement, true);
            loadedSVG.each(function(d, i) {
                this.appendChild(svgFile.cloneNode(true));
            });
        });

        loadedSVG.attr("transform", "translate(" + x + "," + y + ")");
        loadedSVG.attr("transform", "scale(" + scale + ")");

        return loadedSVG;
    }

    // Create an emoji button
    var addEmoji = function(x, y, radius, parent, type) {

        var emoji = parent.append("g");

        // Add the circle
        emoji.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", radius)
            .attr("class", "svg-button");

        // Load SVG
        loadSVG("/emojis/1f603.svg", emoji, x + 10, 0, 0.03);

        // Add classes
        emoji.attr("class", "svg-emoji")
            .on("mouseover", function() {
                d3.select(this)
                    .attr("filter", "url(#glow)");
            })
            .on("mouseout", function() {
                d3.select(this)
                    .attr("filter", null);
            });

        return emoji;

    }

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
            });

        return button;

    }

    // Create an activity
    var addActivity = function(x, y, parent) {

        // Dimensions
        var participationContainerWidth = 30;
        var mainContainerWidth = 170;
        var containerHeight = 500;

        var activity = parent.append("g");

        // Add the participation container
        var participationContainer = activity.append("g").attr("class", "svg-activity-participation");

        participationContainer.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", participationContainerWidth)
            .attr("height", containerHeight);

        var participationLevelX = x + participationContainerWidth / 2;
        var participationLevelY = y + 20;

        var participationLevel = participationContainer.append("text")
            .text("Participation Level %")
            .attr("x", 0)
            .attr("y", 0)
            .attr("class", "participation-level")
            .attr("transform", "translate(" + participationLevelX + "," + participationLevelY + ")");

        // Add the main container
        var mainContainer = activity.append("g").attr("class", "svg-activity");

        mainContainer.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", mainContainerWidth)
            .attr("height", containerHeight);

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
        // var activityEmojis = mainContainer.append("g");
        // addEmoji(x, y, 10, activityEmojis, "smile");

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

    // Time scale and axis
    var yScale = d3.scaleTime()
        .domain([new Date(2000, 0, 1), new Date(2001, 0, 11)])
        .range([0, 800]);
    yAxis = d3.axisLeft().scale(yScale)
        .ticks(16)
        .tickSize(10);
    timeG.attr("id", "yAxisG")
        .call(yAxis);

    // Time label
    var timeLabel = timeG.append("text")
        .text("Time")
        .attr("x", 0)
        .attr("y", 0)
        .attr("class", "svg-label")
        .attr("transform", "translate(0,-" + labelHeight + ")");

    // Draw the Journey section
    // Journey label
    var journeyLabel = journeyG.append("text")
        .text("Journey")
        .attr("x", 0)
        .attr("y", 0)
        .attr("class", "svg-label")
        .attr("transform", "translate(0,-" + labelHeight + ")");

    journeyG.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 50)
        .attr("height", 20)
        .attr("fill", "orange");

    // Draw the Blueprint section
    // Bluepring label
    var blueprintLabel = blueprintG.append("text")
        .text("Blueprint")
        .attr("x", 0)
        .attr("y", 0)
        .attr("class", "svg-label")
        .attr("transform", "translate(0,-" + labelHeight + ")");

    // Create a sample activity
    var activity2 = addActivity(0, 0, blueprintG);

    // Layout: organize sections
    // In case we need to get the transform of an element: https://stackoverflow.com/a/38753017/2237113
    // Translate timeG according to the label width
    var timeGX = timeG.node().getBBox().width;
    timeG.attr("transform", "translate(" + timeGX + "," + labelHeight + ")");
    // Translate journeyG it after the timeG section
    var journeyGX = timeGX + timeG.node().getBBox().x + timeG.node().getBBox().width + gutter;
    journeyG.attr("transform", "translate(" + journeyGX + "," + labelHeight + ")");
    // Translate blueprintG after the journeyG section
    var blueprintGX = journeyGX + journeyG.node().getBBox().width + gutter;
    blueprintG.attr("transform", "translate(" + blueprintGX + "," + labelHeight + ")");

}

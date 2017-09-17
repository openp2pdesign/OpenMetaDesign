import d3 from 'd3';
import {
    TextBox
} from 'd3plus-text';

export default function openmetadesign_viz(data) {

    console.log("DATA: ",data);

    // The container for the viz
    var d3Container = document.getElementById("d3-container");

    // Margins
    // https://bl.ocks.org/mbostock/3019563
    var margin = {
        top: 15,
        right: 0,
        bottom: 0,
        left: 0
    };
    var gutter = 10 + 10 + 10;
    var simpleGutter = 10;
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
    var loadSVG = function(url, parent) {

        var loadedSVG = parent.append("g");

        d3.xml(url).mimeType("image/svg+xml").get(function(xml) {
            var svgFile = document.importNode(xml.documentElement, true);
            loadedSVG.node().appendChild(svgFile);
        });

        return loadedSVG;
    }

    // Create an emoji button
    var addEmoji = function(x, y, radius, parent, type) {

        var emoji = parent.append("g");

        // Add the button circle
        var emojiCircle = emoji.append("circle")
            .attr("cx", x + radius)
            .attr("cy", y + radius)
            .attr("r", radius)
            .attr("class", "svg-button");

        // Load SVG
        var svgIcon = loadSVG("/emojis/1f603_2.svg", emoji);
        svgIcon.attr("transform", "scale(0.035) translate(-20,-320)");

        // Add classes
        emoji.attr("class", "svg-emoji")
            .on("mouseover", function() {
                emojiCircle.attr("filter", "url(#glow)");
            })
            .on("mouseout", function() {
                emojiCircle.attr("filter", null);
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

    // Create a section label
    var addSectionLabel = function(text, parent) {

        var sectionLabel = parent.append("g");

        sectionLabel.append("text")
            .text(text)
            .attr("x", 0)
            .attr("y", 0)
            .attr("class", "svg-label")
            .attr("transform", "translate(0,-" + labelHeight + ")");

        return sectionLabel;
    }

    // Create a line between sections
    var addSectionLine = function(text, parent) {

        var sectionLine = parent.append("g");

        // Add the line
        sectionLine.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x1", 0)
            .attr("y1", 300)
            .attr("class", "svg-lines-line");
        // Add the background behind the text
        sectionLine.append("rect")
            .attr("x", -10)
            .attr("y", 0)
            .attr("width", 20)
            .attr("height", 100)
            .attr("class", "svg-lines-rect");
        // Add the text
        sectionLine.append("text")
            .text(text)
            .attr("x", 0)
            .attr("y", 0)
            .attr("class", "svg-lines-text");

        return sectionLine;
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
            .classed("discuss-button", true)
            .attr("title", "Discuss the activity")
            .classed("button-tooltip", true)
            .attr("data-toggle","tooltip");
        // Edit Button
        var editButton = addButton(x + 30, y, 10, activityButtons, '\uf044');
        editButton.attr("data-toggle", "modal")
            .classed("edit-button", true)
            .attr("title", "Edit the activity")
            .classed("button-tooltip", true)
            .attr("data-toggle","tooltip");
        // Flows Button
        var flowsButton = addButton(x + 55, y, 10, activityButtons, '\uf074');
        flowsButton.attr("data-toggle", "modal")
            .classed("flows-button", true)
            .attr("title", "Edit the flows")
            .classed("button-tooltip", true)
            .attr("data-toggle","tooltip");
        // Issues Button
        var issuesButton = addButton(x + 80, y, 10, activityButtons, '\uf071');
        issuesButton.attr("data-toggle", "modal")
            .classed("issues-button", true)
            .attr("title", "Document contradictions")
            .classed("button-tooltip", true)
            .attr("data-toggle","tooltip");
        // Delete Button
        var deleteButton = addButton(x + 105, y, 10, activityButtons, '\uf068');
        deleteButton.attr("data-toggle", "modal")
            .classed("delete-button", true)
            .attr("title", "Delete the activity")
            .classed("button-tooltip", true)
            .attr("data-toggle","tooltip");
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
        var emoji01 = addEmoji(x, y, 10, activityEmojis, "smile");
        emoji01.attr("title", "I like it!")
            .classed("button-tooltip", true)
            .attr("data-toggle","tooltip");
        var emoji02 = addEmoji(x + 25, y, 10, activityEmojis, "smile");
        emoji02.attr("title", "I like it!")
            .classed("button-tooltip", "true")
            .attr("data-toggle","tooltip");
        var emoji03 = addEmoji(x + 50, y, 10, activityEmojis, "smile");
        emoji03.attr("title", "I like it!")
            .classed("button-tooltip", true)
            .attr("data-toggle","tooltip");

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
    var blueprintCustomerG = svg.append("g");
    var line01G = svg.append("g")
    var blueprintFrontG = svg.append("g");
    var line02G = svg.append("g")
    var blueprintBackG = svg.append("g");
    var line03G = svg.append("g")
    var blueprintSupportG = svg.append("g");
    var journeyG = svg.append("g");

    // Debug: see the border of each group
    svg.attr("style", "outline: thin solid black;");
    journeyG.attr("style", "outline: thin solid red;");

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
    var timeLabel = addSectionLabel("Time", timeG);

    // Draw the Blueprint section
    // Customer section
    var blueprintCustomerLabel = addSectionLabel("Customer processes", blueprintCustomerG);
    // Add Activity button
    var addActivityCustomerButton = addButton(blueprintCustomerLabel.node().getBBox().width+15, -labelHeight-5, 10, blueprintCustomerLabel, '\uf067');
    addActivityCustomerButton.attr("data-toggle", "modal")
        .classed("activity-add-button", true)
        .attr("title", "Add an activity here")
        .classed("button-tooltip", true)
        .attr("data-toggle","tooltip");

    // Create a sample activity
    var activity2 = addActivity(0, 0, blueprintCustomerG);

    // Line01
    addSectionLine("Line 01...", line01G);

    // Front-Office section
    var blueprintFrontLabel = addSectionLabel("Front-Office processes", blueprintFrontG);
    // Add Activity button
    var addActivityFrontButton = addButton(blueprintFrontLabel.node().getBBox().width+15, -labelHeight-5, 10, blueprintFrontLabel, '\uf067');
    addActivityFrontButton.attr("data-toggle", "modal")
        .classed("activity-add-button", true)
        .attr("title", "Add an activity here")
        .classed("button-tooltip", true)
        .attr("data-toggle","tooltip");

    // Create a sample activity
    var activity3 = addActivity(0, 0, blueprintFrontG);

    // Line02
    addSectionLine("Line 02...", line02G);

    // Back-Office section
    var blueprintBackLabel = addSectionLabel("Back-Office processes", blueprintBackG);
    // Add Activity button
    var addActivityBackButton = addButton(blueprintBackLabel.node().getBBox().width+15, -labelHeight-5, 10, blueprintBackLabel, '\uf067');
    addActivityBackButton.attr("data-toggle", "modal")
        .classed("activity-add-button", true)
        .attr("title", "Add an activity here")
        .classed("button-tooltip", true)
        .attr("data-toggle","tooltip");

    // Create a sample activity
    var activity4 = addActivity(0, 0, blueprintBackG);

    // Line03
    addSectionLine("Line 03...", line03G);

    // Support section
    var blueprintSupportLabel = addSectionLabel("Support processes", blueprintSupportG);
    // Add Activity button
    var addActivitySupportButton = addButton(blueprintSupportLabel.node().getBBox().width+15, -labelHeight-5, 10, blueprintSupportLabel, '\uf067');
    addActivitySupportButton.attr("data-toggle", "modal")
        .classed("activity-add-button", true)
        .attr("title", "Add an activity here")
        .classed("button-tooltip", true)
        .attr("data-toggle","tooltip");

    // Create a sample activity
    var activity5 = addActivity(0, 0, blueprintSupportG);

    // Draw the Journey section
    // Journey label
    var journeyLabel = addSectionLabel("Journey", journeyG);

    journeyG.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 50)
        .attr("height", 20)
        .attr("fill", "orange");


    // Layout: organize sections
    // In case we need to get the transform of an element: https://stackoverflow.com/a/38753017/2237113
    // Translate timeG according to the label width
    var timeGX = timeG.node().getBBox().width;
    timeG.attr("transform", "translate(" + timeGX + "," + labelHeight + ")");
    // Translate blueprintCustomerG after the journeyG section
    var blueprintGX = timeGX + timeG.node().getBBox().x + timeG.node().getBBox().width + simpleGutter;
    blueprintCustomerG.attr("transform", "translate(" + blueprintGX + "," + labelHeight + ")");
    // Translate Line01G
    var lineGX = blueprintGX + blueprintCustomerG.node().getBBox().width + gutter / 2;
    line01G.attr("transform", "translate(" + lineGX + "," + labelHeight + ")");
    // Translate blueprintFrontG after the journeyG section
    blueprintGX = blueprintGX + blueprintCustomerG.node().getBBox().width + gutter;
    blueprintFrontG.attr("transform", "translate(" + blueprintGX + "," + labelHeight + ")");
    // Translate Line02G
    lineGX = blueprintGX + blueprintCustomerG.node().getBBox().width + gutter / 2;
    line02G.attr("transform", "translate(" + lineGX + "," + labelHeight + ")");
    // Translate blueprintBackG after the journeyG section
    blueprintGX = blueprintGX + blueprintFrontG.node().getBBox().width + gutter;
    blueprintBackG.attr("transform", "translate(" + blueprintGX + "," + labelHeight + ")");
    // Translate Line03G
    lineGX = blueprintGX + blueprintCustomerG.node().getBBox().width + gutter / 2;
    line03G.attr("transform", "translate(" + lineGX + "," + labelHeight + ")");
    // Translate blueprintSupportG after the journeyG section
    blueprintGX = blueprintGX + blueprintBackG.node().getBBox().width + gutter;
    blueprintSupportG.attr("transform", "translate(" + blueprintGX + "," + labelHeight + ")");
    // Translate journeyG it after the timeG section
    var journeyGX = blueprintGX + blueprintSupportG.node().getBBox().width + simpleGutter;
    journeyG.attr("transform", "translate(" + journeyGX + "," + labelHeight + ")");

}

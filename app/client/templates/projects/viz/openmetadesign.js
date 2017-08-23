import d3 from 'd3';

export default function openmetadesign_viz(data) {

    // The container for the viz
    var d3Container = document.getElementById("d3-container");

    // Get dimensions of the container on window resize
    window.addEventListener("resize", function(d) {
        width = d3Container.clientWidth;
        height = d3Container.clientHeight;
        console.log(width, height);
    });

    // Add the SVG to the container
    var svg = d3.select('#d3-container').append("svg");
    svg.append("rect")
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", 50)
        .attr("height", 100)
        .attr("class", "svg-modal-button")
        .on("mouseover", function() {
            d3.select(this)
                .classed("glow", true);
        })
        .on("mouseout", function() {
            d3.select(this)
                .classed("glow", false);
        })
        .attr("data-toggle", "modal");

    svg.append("rect")
        .attr("x", 40)
        .attr("y", 50)
        .attr("width", 50)
        .attr("height", 100);

    // Filters
    var defs = svg.append("defs");
    var glow = defs.append("filter")
        .attr("id", "glow");
    glow.append("feGaussianBlur")
        .attr("stdDeviation", "3.5")
        .attr("result", "coloredBlur");
    var feMerge = glow.append("feMerge");
    feMerge.append("feMergeNode")
        .attr("in", "coloredBlur");
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");


}

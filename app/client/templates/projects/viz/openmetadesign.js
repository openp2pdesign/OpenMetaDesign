import d3 from 'd3';

export default function openmetadesign_viz(data) {
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

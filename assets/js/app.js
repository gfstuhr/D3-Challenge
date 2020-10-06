// @TODO: YOUR CODE HERE!

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height",svgHeight)
    .attr("width",svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.csv("assets/data/data.csv").then(function(data){
    console.log(data);

    data.forEach(function(d){
        d.poverty = + d.poverty;
    });

    data.forEach(function(d){
        d.healthcareLow = + d.healthcareLow;
    });

    var x_axis = d3.scaleLinear()
        .domain([0, d3.max(data.poverty)])
        .range([0,chartWidth]);
    svg.append("g")
        .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`)
        .call(d3.axisBottom(x_axis));

    var y_axis = d3.scaleLinear()
        .domain([0, d3.max(data.healthcareLow)])
        .range([chartHeight,0]);
    svg.append("g")
        .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`)
        .call(d3.axisLeft(y_axis));

    
    chartGroup.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
            .classed("stateCircle", true)
            .attr("cx", d=> data.poverty)
            .attr("cy", d=> data.healthcareLow);

});
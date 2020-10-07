// @TODO: YOUR CODE HERE!

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 50,
  right: 30,
  bottom: 50,
  left: 50
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

// Open Data
    d3.csv("assets/data/data.csv").then(function(data){

    // Convert Data from strings to numbers
    data.forEach(function(d){
        d.poverty = + d.poverty;
        d.healthcareLow = + d.healthcareLow;
    });

    // Linear scales for each axis
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.poverty-1),d3.max(data, d => d.poverty)+1])
        .range([0,chartWidth]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.healthcareLow)-1, d3.max(data, d => d.healthcareLow)+1])
        .range([chartHeight, 0])
    
    // Set x and y axis
    var x_axis = d3.axisBottom(xLinearScale);
    var y_axis = d3.axisLeft(yLinearScale).ticks(10);


    // Drawing each axis
    chartGroup.append("g")
        .call(y_axis)
    
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight} )`)
        .call(x_axis);

        // Tooltip
    var toolTip=d3.tip()
        .attr("class", "tootip")
        .offset([0,10])
        .html(function(d){
            return(d.state)
        });
    
    chartGroup.call(toolTip)

    // Plotting data
    chartGroup.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
            .attr("r",10)
            .attr("cx", d=> xLinearScale(d.poverty))
            .attr("cy", d=> yLinearScale(d.healthcareLow))
            .classed("stateCircle",true)
            .on("mouseover", function(data){
                toolTip.show(data, this);
            }).on("mouseout", function(data, index){
                toolTip.hide(data);
            });
        
    //Adding Plot Text 
    chartGroup.selectAll("dot")
        .data(data)
        .enter()
        .append("text")
            .attr("x", d=>xLinearScale(d.poverty))
            .attr("y", d=>yLinearScale(d.healthcareLow)+ 1)
            .text(d => d.abbr)
            .attr("font-size", "10px")
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .on("mouseover", function(data){
                toolTip.show(data, this);
            }).on("mouseout", function(data, index){
                toolTip.hide(data);
            });
    
    // Create axes labels

    var x_labels = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top-20 })`)

    var povertylabel = x_labels.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "poverty") 
        .classed("active", true)
        .text("In Poverty (%)");
    
    var y_labels = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        
    var healthcare_label=y_labels.append("text")
        .attr("x", 0 - (chartHeight/2))
        .attr("y", 15 - chartMargin.left)
        .attr("value", "healthcare") 
        .classed("active", true)
        .text("Lacks Healthcare (%)");

}).catch(function(error){
    console.log(error);
});
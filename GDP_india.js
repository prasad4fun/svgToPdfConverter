function formatTwoDigitYear(d) { return d.toString().substr(2,2); }
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, -10]);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(formatTwoDigitYear)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var svg2 = d3.select("#graph2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("json files/GDP_india.json",function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.year; }));
  y.domain([-10, d3.max(data, function(d) { return d.Value; })]);

  svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg2.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("GDP (Growth %)");

  svg2.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Value); })
      .attr("height", function(d) { return height - y(d.Value); });
});

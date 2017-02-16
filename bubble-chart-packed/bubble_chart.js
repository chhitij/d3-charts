var jsonArr = [];

var tools = ['adobe', 'photoshop', 'googlesheet', 'excel'];


for (var i = 0; i < 30; i++) {
  jsonArr.push({
    "urlFamily": Math.random().toString(16).slice(2, 8).toUpperCase(),
    "count": Math.random() * Math.random() * Math.random(),
  });
}

var a = {
  "urlMetrics": jsonArr
};

var data = {
  "name": "Url",
  "urlFamily": "URL",
  "children": a.urlMetrics
};


var color = d3.scaleLinear().domain([1, jsonArr.length])
  .interpolate(d3.interpolateHcl)
  .range([d3.rgb("#145587"), d3.rgb('#b7951b'), d3.rgb('#bd3e31')]);

var HOUR = 60 * 60;

/**
 * Seconds in a minute. Used for converting seconds to minutes.
 */
var MINUTE = 60;
var svg = d3.select("svg"),
  diameter = +svg.attr("width"),
  g = svg.append("g").attr("transform", "translate(2,2)"),
  format = function (size) {
    var time;
    if (size > HOUR) {
      time = (size / HOUR).toFixed(2) + ' hours';
    } else if (size > MINUTE) {
      time = (size / MINUTE).toFixed(2) + ' minutes';
    } else {
      time = size.toFixed(2) + ' seconds';
    }
    return time;
  };

var pack = d3.pack()
  .size([diameter - 5, diameter - 5]);



data = d3.hierarchy(data)
  .sum(function (d) { return d.count; })
  .sort(function (a, b) { return b.value - a.value; });

var node = g.selectAll(".node")
  .data(pack(data).descendants())
  .enter().append("g")
  .attr("class", function (d) { return d.children ? "node" : "leaf node"; })
  .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });


var circles = node.append("circle")
  .style("fill", function (d, i) { return d.children ? '' : color(i); })
  .attr("r", function (d) { return 2; })
  .on('mouseover',
  function () {
    if (this.parentNode.classList.contains('leaf')) {
      this.style.stroke = "gray";
      this.style.strokeWidth = "2";

    }
  })
  .on('mouseout',
  function () {
    d3.select("#tooltip").style('display', 'none')

    this.style.stroke = "none";
  })
  .on('mousemove', function (d) {
    var xPosition = d3.mouse(this)[0] + d.x - 77;
    var yPosition = d3.mouse(this)[1] + d.y - 10;
    d3.select("#tooltip #tooltipText").html('<div><b>' + d.data.urlFamily + '</b></div>' + format(d.data.count));
    d3.select("#tooltip").style('top', yPosition + "px").style('left', xPosition + "px").style('display', 'block')
  });

circles.filter(function (d) { return !d.children; }).transition()
  .ease(d3.easeElastic)
  .duration(4000)
  .attr(
  'r',
  function (d) {
    return d.r;
  });


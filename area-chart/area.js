var data = [{"user":"EMPTY","dateUnit":1,"dateUnitValueString":"18-JAN-2017","productiveTime":"46.81420072041103","unproductiveTime":"1.5007713128084643","desktopTime":"8.037972921810779","idleTime":"43.64705504496973","productiveTimeValue":"3.3402875","unproductiveTimeValue":"0.10708305555555556","desktopTimeValue":"0.5735255555555555","idleTimeValue":"3.114305277777778"},{"user":"EMPTY","dateUnit":1,"dateUnitValueString":"22-JAN-2017","productiveTime":"35.57680640013593","unproductiveTime":"1.257343532063008","desktopTime":"14.159902757340681","idleTime":"49.00594731046038","productiveTimeValue":"2.0287119444444444","unproductiveTimeValue":"0.07169805555555556","desktopTimeValue":"0.8074463888888889","idleTimeValue":"2.794487777777778"},{"user":"EMPTY","dateUnit":1,"dateUnitValueString":"23-JAN-2017","productiveTime":"38.52108010792983","unproductiveTime":"15.341548828585372","desktopTime":"6.453769717714207","idleTime":"39.68360134577058","productiveTimeValue":"4.091996111111111","unproductiveTimeValue":"1.629693611111111","desktopTimeValue":"0.6855675","idleTimeValue":"4.215487777777778"},{"user":"EMPTY","dateUnit":1,"dateUnitValueString":"24-JAN-2017","productiveTime":"0.0","unproductiveTime":"0.0","desktopTime":"0.0","idleTime":"0.0","productiveTimeValue":"0.0","unproductiveTimeValue":"0.0","desktopTimeValue":"0.0","idleTimeValue":"0.0"},{"user":"EMPTY","dateUnit":1,"dateUnitValueString":"25-JAN-2017","productiveTime":"23.205186155424627","unproductiveTime":"15.110309865217703","desktopTime":"3.3676938080355314","idleTime":"58.31681017132214","productiveTimeValue":"3.157827222222222","unproductiveTimeValue":"2.056253611111111","desktopTimeValue":"0.4582852777777778","idleTimeValue":"7.935916111111111"},{"user":"EMPTY","dateUnit":1,"dateUnitValueString":"26-JAN-2017","productiveTime":"0.0","unproductiveTime":"0.0","desktopTime":"0.0","idleTime":"0.0","productiveTimeValue":"0.0","unproductiveTimeValue":"0.0","desktopTimeValue":"0.0","idleTimeValue":"0.0"},{"user":"EMPTY","dateUnit":1,"dateUnitValueString":"27-JAN-2017","productiveTime":"34.41715545340943","unproductiveTime":"0.7224249933863502","desktopTime":"1.9754122305075357","idleTime":"62.88500732269669","productiveTimeValue":"2.8220630555555557","unproductiveTimeValue":"0.059235833333333335","desktopTimeValue":"0.16197555555555557","idleTimeValue":"5.156308055555556"},{"user":"EMPTY","dateUnit":1,"dateUnitValueString":"28-JAN-2017","productiveTime":"0.0","unproductiveTime":"0.0","desktopTime":"0.0","idleTime":"0.0","productiveTimeValue":"0.0","unproductiveTimeValue":"0.0","desktopTimeValue":"0.0","idleTimeValue":"0.0"},{"user":"EMPTY","dateUnit":1,"dateUnitValueString":"29-JAN-2017","productiveTime":"0.0","unproductiveTime":"0.0","desktopTime":"0.0","idleTime":"0.0","productiveTimeValue":"0.0","unproductiveTimeValue":"0.0","desktopTimeValue":"0.0","idleTimeValue":"0.0"},{"user":"EMPTY","dateUnit":1,"dateUnitValueString":"30-JAN-2017","productiveTime":"0.0","unproductiveTime":"0.0","desktopTime":"0.0","idleTime":"0.0","productiveTimeValue":"0.0","unproductiveTimeValue":"0.0","desktopTimeValue":"0.0","idleTimeValue":"0.0"},{"user":"EMPTY","dateUnit":1,"dateUnitValueString":"31-JAN-2017","productiveTime":"45.768877377603594","unproductiveTime":"0.5054596710430938","desktopTime":"0.9881523371875293","idleTime":"52.737510614165785","productiveTimeValue":"2.608943611111111","unproductiveTimeValue":"0.0288125","desktopTimeValue":"0.05632722222222222","idleTimeValue":"3.006173611111111"}];

var keys = ['productiveTime', 'unproductiveTime', 'desktopTime', 'idleTime'];

// var colors = [ '#56a7c6', '#5ad4bb', '#a0da7e', '#bbd3cd'];

var colors = ['#425cb4', '#eb023b', '#efd079', '#efefef' ];

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

var parseDate = d3.timeParse("%d-%b-%Y");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);


var stack = d3.stack().keys(keys);
data = data.filter(function(d, i) {
  if (d.productiveTime != '0.0')
    return d;
});

data = data.map(function(d, i) {
    return type(d, i ,keys);
});

var area = d3.area()
    .curve(d3.curveBasis)
    .x(function(d, i) { return x(d.data.dateUnitValueString); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); });



var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  x.domain(d3.extent(data, function(d) { return d.dateUnitValueString; }));
  z.domain(keys);

  var layer = g.selectAll(".layer")
      .data(stack(data))
      .enter().append("g");

      layer.attr("class", "layer").append("path")
      .attr("class", function(d) { return d.key;})
      .attr("stroke", function(d, i) { return colors[i]; })
      .style("fill", function(d, i){ 
        return "url(#gradient"+i+")";
      })
      .style("fill-opacity", 0.2)
      .attr("offset", function(d) { return d.offset; })
      .attr("d", area)
      .on('mouseover', function(d, i) {
        d3.select(this).style('opacity', '1');
        var xPosition = d3.event.x + 8;
        var yPosition = d3.event.y - 8;
        d3.select('.tooltip .title').text(d.key.toUpperCase());
        d3.select('.tooltip').style('top', yPosition + 15 + 'px')
                      .style('left', xPosition + 102 + 'px')
                      .style('display', 'flex');
      })
      .on('mouseout', function(d) {
        d3.select('.tooltip').style('display', 'none');
      })
      .filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
      .append("text")
      .attr("x", width - 6)
      .attr("y", function(d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2); })
      .attr("dy", ".35em")
      .style("font", "10px sans-serif")
      .style("text-anchor", "end")
      .text(function(d) { return d.key; });
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"));
      

function type(d, i, columns) {
  d.dateUnitValueString = parseDate(d.dateUnitValueString);
  for (var j = 0, n = columns.length; j < n; j++) {
    d[columns[j]] = Number(d[columns[j]])/100;
  };
  return d;
}

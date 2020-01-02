d3.json('data/newham_20200102.json', function(data) {
	items = data.items;
	renderCharts(getData(items));
});

function getData(items) {
	output = [];

	$.each(items, function(index,value) {
		if (value.state != "deleted") {
			output.push(value);
		}
	});

	return output;

}

function renderCharts(items) {
	var cf = crossfilter(items);
	var all = cf.groupAll();

	var activityChart = dc.rowChart('#chart2');

	var activity = cf.dimension(function (d) {
		return d.data.activity[0];
	});

	var activityGroup = activity.group();

	activityChart
		.width(400)
		.height(800)
		.dimension(activity)
		.group(activityGroup);
	
	var genderChart = dc.pieChart('#chart1');

	var gender = cf.dimension(function (d) {
		return d.data.genderRestriction;
	});

	var genderGroup = gender.group();

	genderChart
		.width(180)
		.height(180)
		.radius(80)
		.dimension(gender)
		.group(genderGroup);

//	var priceChart = dc.rowChart('#chart3');

	var price = cf.dimension(function (d) {
		return parseFloat(d.data.offer.price);
	});

	var priceGroup = price.group();
/*
	priceChart
		.width(400)
		.height(800)
		.ordering(function(d) { return +d.key })
		.dimension(price)
		.group(priceGroup);
*/
	var selectChart = new dc.barChart('#chart4');

	selectChart 
		.dimension(price)
		.group(priceGroup)
		.height(200)
		.width(600)
		.x(d3.scaleLinear().domain([0, 20]));

	selectChart.xAxis().tickFormat(function(d) {
		var f = d3.format('.2f');
		return ("£" + f(d));
	});

	dc.renderAll();

}
$( document ).ready(function() {
	d3.json('data/everyone-active_20200106.json', function(data) {
		items = data.items;
		renderCharts(getData(items));
	});
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

	var activityChart = dc.rowChart('#chart1');

	var activity = cf.dimension(function (d) {
		return d.data.activity[0].prefLabel;
	});

	var activityGroup = activity.group();

	activityChart
		.width(400)
		.height(800)
		.dimension(activity)
		.group(activityGroup);

	var minPrice = 0;
	var maxPrice = 0;
	var f = d3.format('.2f');

	var price = cf.dimension(function (d) {
		thisPrice = d.data.offers[0].price;
		if (thisPrice < minPrice) {
			minPrice = thisPrice;
		}
		if (thisPrice > maxPrice) {
			maxPrice = thisPrice;
			$("#costHigh").text("£" + f(thisPrice));
			$("#costHigh").val(thisPrice);
		}
		return thisPrice;
	});
	
	$( "#costSlider" ).slider({
		range: true,
		min: 0,
		max: maxPrice,
		step:1,
		values: [ 0, maxPrice ],
		range: true,
		slide: function( event, ui ) {
			$( "#costLow" ).text("£" + f(ui.values[ 0 ]));
			$( "#costHigh" ).text( "£" + f(ui.values[ 1 ]));
			$( "#costLow" ).val(ui.values[ 0 ]);
			$( "#costHigh" ).val( ui.values[ 1 ]);
			if(document.getElementById("costLow").value != "") {
				start = document.getElementById("costLow").value;
			};
			if(document.getElementById("costHigh").value != "") {
				end = document.getElementById("costHigh").value;
			};
			price.filterRange([start,end]);
			dc.redrawAll();
			if ( (ui.values[0]+0.1 ) >= ui.values[1] ) {
				return false;
			}
		}
	});

	function reduceAdd(p, v) {
	  if (v.data.eventSchedule) {
	  	v.data.eventSchedule.byDay.forEach (function(val, idx) {
	     p[val] = (p[val] || 0) + 1; //increment counts
	  	});
	  } else {
	  	p['unknown'] = (p['unknown'] || 0) + 1;
	  }
	  return p;
	}

	function reduceRemove(p, v) {
	  if (v.data.eventSchedule) {
	  	v.data.eventSchedule.byDay.forEach (function(val, idx) {
	     	p[val] = (p[val] || 0) - 1; //decrement counts
	  	});
	  } else {
	  	p['unknown'] = (p['unknown'] || 0) - 1;
	  }
	  return p;
	}

	function reduceInitial() {
	  return {};  
	}

	var dayOfWeek = cf.dimension(function(d) {
		if (d.data.eventSchedule) {
			return d.data.eventSchedule.byDay;
		} else {
			return "unknown";
		}
	});

	var dayOfWeekGroup = dayOfWeek.groupAll().reduce(reduceAdd,reduceRemove,reduceInitial).value();

	dayOfWeekGroup.all = function() {
		var newObject = [];
		  for (var key in this) {
		    if (this.hasOwnProperty(key) && key != "all") {
		      newObject.push({
		        key: key,
		        value: this[key]
		      });
		    }
		  }
		 return newObject;
	}

	var dayOfWeekChart = dc.rowChart("#dayOfWeek");
    dayOfWeekChart                              
	    .renderLabel(true)
	    .width(400)
	    .height(200)
	    .dimension(dayOfWeek)
	    .group(dayOfWeekGroup)
	    .filterHandler(function(dimension, filter){     
	        dimension.filter(function(d) {return dayOfWeekChart.filter() != null ? d.indexOf(dayOfWeekChart.filter()) >= 0 : true;}); // perform filtering
	        return filter; // return the actual filter value
	       })
	    .xAxis().ticks(0);

	var geo = cf.dimension(function(d) {
		if (d.data.location.geo) {
			point = d.data.location.geo.latitude + "," + d.data.location.geo.longitude;
			return point;
		} else {
			return "0,0";
		}
	});

	var geoGroup = geo.group();

	var mapChart = dc_leaflet.markerChart('#map');

	mapChart
		.dimension(geo)
		.group(geoGroup)
		.width(600)
		.height(800)
		.center([53.2,-1.5])
		.zoom(7)
		.cluster(true);

	var minDuration = 100;
	var maxDuration = 0;

	var duration = cf.dimension(function(d) {
		dur = d.data.duration;
		thisDuration = moment.duration(dur).asMinutes();
		if(thisDuration < minDuration) {
			minDuration = thisDuration;
			$("#durationLow").text(thisDuration);
			$("#durationLow").val(thisDuration);
		}
		if (thisDuration > maxDuration) {
			maxDuration = thisDuration;
			$("#durationHigh").text(thisDuration);
			$("#durationHigh").val(thisDuration);
		}
		return thisDuration;
	});
	
	$( "#durationSlider" ).slider({
		range: true,
		min: minDuration,
		max: maxDuration,
		step:1,
		values: [ 0, maxDuration ],
		range: true,
		slide: function( event, ui ) {
			$( "#durationLow" ).text(ui.values[ 0 ]);
			$( "#durationHigh" ).text(ui.values[ 1 ]);
			$( "#durationLow" ).val(ui.values[ 0 ]);
			$( "#durationHigh" ).val( ui.values[ 1 ]);
			if(document.getElementById("durationLow").value != "") {
				start = document.getElementById("durationLow").value;
			};
			if(document.getElementById("durationHigh").value != "") {
				end = document.getElementById("durationHigh").value;
			};
			duration.filterRange([start,end]);
			dc.redrawAll();
			if ( (ui.values[0]+0.1 ) >= ui.values[1] ) {
				return false;
			}
		}
	});


	dc.renderAll();

}
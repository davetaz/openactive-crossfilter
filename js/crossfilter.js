//When all dependancies have loaded, load the data. We'll do this locally to save a remote call.
$( document ).ready(function() {
	d3.json('https://davetaz.github.io/openactive-crossfilter/data/example.json', function(data) {
		items = data.items;
		renderCharts(getData(items));
	});
});

//Once the data is loaded, render the page
function renderCharts(items) {

	//Create the cross filter
	var cf = crossfilter(items);
	var all = cf.groupAll();

	//Add search box
	var searchText = cf.dimension(function(d) {
		return getSearchText(d);
	});

	var search = new dc.textFilterWidget("#search");

	search.dimension(searchText);

	//Add activity chart (assume first one only)
	var activityChart = dc.rowChart('#activityChart');

	var activity = cf.dimension(function (d) {
		return d.data.activity[0].prefLabel;
	});

	var activityGroup = activity.group();

	//Here is the handler for the array of categories
	var category = cf.dimension(function (d) {
		return d.data.category;
	});

	var categoryGroup = category.groupAll().reduce(reduceAddCategories,reduceRemoveCategories,reduceInitial).value();

	categoryGroup.all = function() {
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

	activityChart
		.width(400)
		.height(800)
		.dimension(activity)
		.group(activityGroup)
		//.dimension(category)
		//.group(categoryGroup)
		//.filterHandler(function(dimension, filter){     
	    //    dimension.filter(function(d) {return activityChart.filter() != null ? d.indexOf(activityChart.filter()) >= 0 : true;}); // perform filtering
	    //    return filter; // return the actual filter value
	    //   })
		.xAxis().ticks(0);

	//Add cost slider
	var minPrice = 0;
	var maxPrice = 0;
	
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

	// Dats of week, need to move the cleaning to the pre-processor
	var dayOfWeek = cf.dimension(function(d) {
		if (d.data.eventSchedule) {
			return d.data.eventSchedule.byDay;
		} else {
			return fillDays(d.data.subEvent);
		}
	});

	//var dayOfWeekGroup = dayOfWeek.groupAll();

	var dayOfWeekGroup = dayOfWeek.groupAll().reduce(reduceAddDays,reduceRemoveDays,reduceInitial).value();

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

	var dayOfWeekChart = dc.rowChart("#dayOfWeekChart");
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

	var locations = {};

	// The map
	var geo = cf.dimension(function(d) {
		if (d.data.location.geo) {
			point = d.data.location.geo.latitude + "," + d.data.location.geo.longitude;
			locations[point] = d.data.location;
			return point;
		} else {
			// TODO fix to geocode in the pre-processor?
			return "0,0";
		}
	});

	var geoGroup = geo.group();

	var mapChart = dc_leaflet.markerChart('#map');

	mapChart
		.dimension(geo)
		.group(geoGroup)
		.width(350)
		.height(450)
		.center([53.2,-1.5])
		.zoom(6)
		.cluster(false)
		.popup(function(d) {
			loc = locations[d.key];
			if (loc) {
				return "<h2><a target='_blank' href='"+loc.url+"'>" + loc.name + "</a></h2>"+"<p>" + loc.address.streetAddress + "<br/>" + loc.address.addressLocality + "<br/>" + loc.address.addressRegion + "<br/>" + loc.address.postalCode + "<br/><br/>" + loc.telephone;
			} else {
				return "unknown";
			}
		});


	var startTime = cf.dimension(function(d) {
		return d.data.subEvent[0].startTime;
	});

	$( "#startTimeSlider" ).slider({
		range: true,
		min: 0,
		max: 1439,
		step:15,
		values: [ 0, 1439],
		range: true,
		slide: function( event, ui ) {
			$( "#startTimeLow" ).text(minutesToTime(ui.values[ 0 ]));
			$( "#startTimeHigh" ).text(minutesToTime(ui.values[ 1 ]));
			$( "#startTimeLow" ).val(ui.values[ 0 ]);
			$( "#startTimeHigh" ).val( ui.values[ 1 ]);
			if(document.getElementById("startTimeLow").value != "") {
				start = document.getElementById("startTimeLow").value;
			};
			if(document.getElementById("startTimeHigh").value != "") {
				end = document.getElementById("startTimeHigh").value;
			};
			startTime.filterRange([start,end]);
			dc.redrawAll();
			if ( (ui.values[0]+0.1 ) >= ui.values[1] ) {
				return false;
			}
		}
	});

	// Duration slider
	var minDuration = 100;
	var maxDuration = 0;

	var duration = cf.dimension(function(d) {
		dur = d.data.duration;
		thisDuration = moment.duration(dur).asMinutes();
		if(thisDuration < minDuration) {
			minDuration = thisDuration;
			$("#durationLow").text(timeConvert(thisDuration));
			$("#durationLow").val(thisDuration);
		}
		if (thisDuration > maxDuration) {
			maxDuration = thisDuration;
			$("#durationHigh").text(timeConvert(thisDuration));
			$("#durationHigh").val(thisDuration);
		}
		return thisDuration;
	});
	
	$( "#durationSlider" ).slider({
		range: true,
		min: minDuration,
		max: maxDuration,
		step:5,
		values: [ 0, maxDuration ],
		range: true,
		slide: function( event, ui ) {
			$( "#durationLow" ).text(timeConvert(ui.values[ 0 ]));
			$( "#durationHigh" ).text(timeConvert(ui.values[ 1 ]));
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

	// The cards in the data grid
	var dataGrid = dc.dataGrid("#dc-data-grid");

	dataGrid
	    .dimension(activity)
	    .section(function (d) {
	        return d.id;
	    })
	  	.size(1000)
	    .html(function(d) {
	    	return '<h2 class="activity">'+d.data.activity[0].prefLabel+'</h2>'+'<h3 class="name">'+d.data.name+'</h3>'+'<div class="age">'+d.data.ageRange.name+'</div>'+'<div class="priceRange">'+getPriceRange(d.data.offers)+'</div>'+'<div class="duration">'+timeConvert(moment.duration(d.data.duration).asMinutes())+'</div>'+'<p class="description">'+d.data.description+'</p>'+'<div class="upcoming">'+getSubEvents(d.data.subEvent)+'</div>';
	    })
	    .sortBy(function (d) {
	        return d.data.activity[0].prefLabel;
	    });


	dc.renderAll();

}
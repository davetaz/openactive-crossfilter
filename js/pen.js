//This first function uses the d3 library to load and parse a data feed of OpenActive activities. This is parsed into the data object upon which we then perform a function.
d3.json('https://davetaz.github.io/openactive-crossfilter/data/example.json', function(data) {

  //The OpenActive opportunities are nested with a variable called items, so let's get that.
		items = data.items;
    //renderCharts(getData(items));

  //Next we call the renderPage function (below) with our items. However we first pass all the items through a preProcessor which helps clean and organise all the dirty data! This pre-processor is available to view at https://github.com/davetaz/openactive-crossfilter/blob/master/js/helpers.js
		renderPage(preprocess(items));

});

//The renderPage function takes an input of all the items in the data that we can use to draw the page.
function renderPage(items) {

	//We are going to created a facetted browser (like skyscanner.net)
  //Another word for a facetted browser is a crossfilter, and we are going to utilise the crossfilter library to create this from our data.

	var cf = crossfilter(items);

  //Everything is going to be grouped into one big crossfilter, so changing one facet will affect everything displayed on our screen.
  var all = cf.groupAll();

  // STEP 1 CODE GOES HERE
  /*

  session = items[0]
  $('#dc-data-grid').append("<h1>" + session.data.name + "</h1>");

  */
  // END OF STEP 1

  //STEP 2 CODE GOEs HERE

  /*

  items.forEach(function(session) {
    $('#dc-data-grid').append("<h1>" + session.data.name + "</h1>");
    $('#dc-data-grid').append("<p>" + session.data.description + "</p>");
  });
  */
  // END OF STEP 2

  // /* UNCOMMMENT THIS BLOCK FOR STEP 3

  //Here is the boiler plate code to make a facet for the activity name in our crossfilter.

  //Here we define a variable (call activity) and set it to a dimension in our crossfilter.

  //From within the crossfilter we are interested in the activity name, which can be extracted from the first item (0) in the activity array.

  var activity = cf.dimension(function (d) {
		return d.data.activity[0].prefLabel;
	});

  //We want to group all the activities together, when we plot our chart this helps displays the total instances of each actvity in the dataset
	var activityGroup = activity.group();

  //STEP 3 CODE GOES HERE
  var dataGrid = dc.dataGrid('#dc-data-grid');
  //var offers = session.data.offers;
  //var costs = getPriceRange(offers);
  dataGrid
        .html(function(session) {
            return '<item>' + '<h1>' + session.data.name + '</h1>' + '<p>' + session.data.description + '</p>' + '<br> <p>' + getPriceRange(session.data.offers) + '</item>';
        });

  //This next block sets up the dataGrid to depend on activityName as a key variable, gives each item in the grid an ID and limits the number of displayed items on the screen to 1000.
  dataGrid
    .dimension(activity)
    .section(function(item) {
      return item.id;
    })
    .size(1000);

  // */
  //END OF STEP 3

  //STEP 4 CODE GOES HERE

  var activityChart = dc.rowChart('#activityChart');
  activityChart
	  .colors(['red','blue','green'])
    .width(400)
    .height(200)
    .dimension(activity)
    .group(activityGroup);

  // start time slider

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
			$("#costHigh").text("£" + currency(thisPrice));
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
			$( "#costLow" ).text("£" + currency(ui.values[ 0 ]));
			$( "#costHigh" ).text( "£" + currency(ui.values[ 1 ]));
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

  // days of week picker

	function getDay(events) {
		var ret = [];
		events.forEach (function(val,idx) {
			start = val.startDate;
			formatted = moment(start).format("dddd");
			ret.push(formatted);
		});
		return ret;
	}

  var dayOfWeek = cf.dimension(function(d) {
		schemaDay = d.data.eventSchedule;
		foo = schemaDay;
		bar = schemaDay.slice(0,5);
		baz = 'BAZ';
		console.log(baz);
		}
	);

	/*
	var dayOfWeek = cf.dimension(function(d) {
		if (d.data.eventSchedule) {
			schemaDay = toString(d.data.eventSchedule);
			foo = schemaDay.split('/');
			bar = schemaDay.slice(0,5);
			return bar;
		} else {
			return getDay(d.data.subEvent);
		}
	});

	*/

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

  // add search box

  var searchText = cf.dimension(function(item) {
    return item.data.name + " " + item.data.description;
	});

	var search = dc.textFilterWidget("#search");

	search.dimension(searchText);

  // add the map

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
		.cluster(true)
		.popup(function(d) {
			loc = locations[d.key];
			if (loc) {
				return "<h2><a target='_blank' href='"+loc.url+"'>" + loc.name + "</a></h2>"+"<p>" + loc.address.streetAddress + "<br/>" + loc.address.addressLocality + "<br/>" + loc.address.addressRegion + "<br/>" + loc.address.postalCode + "<br/><br/>" + loc.telephone;
			} else {
				return "unknown";
			}
		});

  //Finally we render the objects on the HTML. This line MUST stay at the end of your code
	dc.renderAll();

}

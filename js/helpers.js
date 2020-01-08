//Process and tidy the data. Also create new data points as required. 
//All preprocessing should be done here (or in the harvester)
function getData(items) {
	output = [];

	$.each(items, function(index,value) {
		if (value.state != "deleted") {
			//Get a start time in minutes since midnight
			value.data.subEvent.forEach(function(item,idx) {
				total = 0;
				start = item.startDate;
				hours = moment(start).format("H");
				minutes = moment(start).format("m");
				total = Number(60 * hours) + Number(minutes);
				item.startTime = total;
			});

			//TODO move cleaning of days to here

			output.push(value);
		}
	});
	return output;
}


function getCategoriesString(cats) {
	categories = "";
		cats.forEach (function(val, idx) {
		categories += val + " ";
	});
	return categories;
}

function getSearchText(d) {
	return d.data.activity[0].prefLabel + " " + d.data.name + " " + d.data.description + " " + d.data.location.name + " " + d.data.location.address.addressLocality + " " + d.data.location.address.addressRegion + " " + getCategoriesString(d.data.category);
}

function reduceAddDays(p, v) {
	if (v.data.eventSchedule) {
	  	v.data.eventSchedule.byDay.forEach (function(val, idx) {
	    	p[val] = (p[val] || 0) + 1; //increment counts
	  	});
	} else {
	  	fillDays(v.data.subEvent).forEach (function(val, idx) {
	  		p[val] = (p[val] || 0) + 1; //decrement counts
	  	});
	}
	return p;
}

function reduceRemoveDays(p, v) {
	if (v.data.eventSchedule) {
	  	v.data.eventSchedule.byDay.forEach (function(val, idx) {
	     	p[val] = (p[val] || 0) - 1; //decrement counts
	  	});
	} else {
		fillDays(v.data.subEvent).forEach (function(val, idx) {
	  		p[val] = (p[val] || 0) - 1; //decrement counts
	  	});
	}
	return p;
}

function reduceAddCategories(p, v) {
	v.data.category.forEach (function(val, idx) {
	    p[val] = (p[val] || 0) + 1; //increment counts
	});
	return p;
}

function reduceRemoveCategories(p, v) {
	v.data.category.forEach (function(val, idx) {
	    p[val] = (p[val] || 0) - 1; //increment counts
	});
	return p;
}

function reduceInitial() {
  return {};  
}

function fillDays(events) {
	var ret = [];
	events.forEach (function(val,idx) {
		start = val.startDate;
		formatted = moment(start).format("dddd");
		ret.push('http://schema.org/' + formatted);
	});
	return ret;
}

function timeConvert(num) {
	hours = (num / 60);
	rhours = Math.floor(hours);
	minutes = (hours - rhours) * 60;
	rminutes = Math.round(minutes);
	return rhours + "h" + rminutes+"m";
}

function minutesToTime(raw) {
	hours = Math.floor(raw / 60);
	minutes = Number(raw) - Number(60 * hours);
	return moment("2010-10-10 " + hours + ":" + minutes + ":00").format("HH:mm");
}

function getPriceRange(offers) {
	var minPrice = 1000;
	var maxPrice = 0;
	offers.forEach (function(val,idx) {
	   	if (val.price < minPrice) {
	   		minPrice = val.price;
	   	}
	   	if (val.price > maxPrice) {
	   		maxPrice = val.price;
		}
	});
	if (minPrice == maxPrice) {
	  	return "£" + f(minPrice);
	} else {
		return "£" + f(minPrice) + " - £" + f(maxPrice);
   }
}

function getSubEvents(events) {
	var ret = "";
	events.forEach (function(val,idx) {
		start = val.startDate;
		formatted = moment(start).format("dddd, MMMM Do YYYY @ HH:mm");
		ret += '<item>' + formatted + '</item>';
	});
	return ret;
}
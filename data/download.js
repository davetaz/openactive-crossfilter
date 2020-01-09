/*
 * download.js
 * Harvest n pages of openactive data from a provider.
 * By detault 10 pages of data are downloaded from everyone active
 * Usage: 
 *    node download.js <sessions url> <number of pages to fetch>
 */

const http = require('http');
const fs = require('fs');

var myArgs = process.argv.slice(2);

let url = "http://everyoneactivelive-openactive.azurewebsites.net/api/sessions";
let maxCount = 5;

if (myArgs[0]) {
	url = myArgs[0];
}

if (myArgs[1]) {
	maxCount = myArgs[1];
}

items = [];

json = fetchDataFromUrl(url,items);

var count = 0;

function fetchDataFromUrl(url) {
	console.log("Processing " + url);
	http.get(url,(res) => {
    let body = "";

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            let json = JSON.parse(body);
            items.push(json.items);
            //console.log(items[url][0]);
            count = count + 1;
            if (count < maxCount) {
    			fetchDataFromUrl(json.next);
    		} else {
    			processItems(items);
    		}
        } catch (error) {
            console.error(error.message);
        };
    });

	}).on("error", (error) => {
    	console.error(error.message);
	});
}


function processItems(items) {
	object = {};
	object.items = [];
	if (items instanceof Array) {
		console.log('IS Array');
	}
	items.forEach(function(element) {
		element.forEach(function(item) {
			object.items.push(item);
		});
	});
	var jsonContent = JSON.stringify(object,null,4);

	fs.writeFile("data/data.json", jsonContent, 'utf8', function (err) {
	    if (err) {
	        console.log("An error occured while writing JSON Object to File.");
	        return console.log(err);
	    }
	 
	    console.log("JSON file has been saved.");
	});
}


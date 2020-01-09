# Openactive crossfilter

A demo to load some OpenActive data and draw a crossfilter like skyscanner.net

This example has been developed to be used in training and as a reference.

*Note* This version has been written explicitly to work with the EveryoneActive data feed at http://everyoneactivelive-openactive.azurewebsites.net/api/sessions

# Installing 

1. Download
2. npm install

# Downloading some data

By default the data is sourced from a local json file "data/data.json"

Due to the way OpenActive data feeds are paginated, you will need to download a number of pages of data to make it work.

To do this:

1. cd data
2. node download.js <sessions url> <number of pages to download>


# Viewing in a browser

*Note* Double clicking index.html and opening this in a web browser will not work. The content must be hosted via a web server. There are many ways to simply launch a web server from the root directory including via node, python, php etc. Just search the web for "<operating system> <language you like> command line web server". 

Examples include:
 * php -S localhost:8080 
 * python -m SimpleHTTPServer 8080
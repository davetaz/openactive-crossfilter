# Steps to learn how to build the cross filter

TODO: Make helpers a classed thing, so you call helpers.reduceAdd...

## Step 1 - Cards to go in the data Grid

### Requirements

Boiler plate HTML, Javascript and CSS already built!

http://bit.ly/OA-Pen

### Process

1. Download a data feed containing five records

2. Create a card displaying the information for one item. 
	* Name
	* Description
	* Age range (reference function)
	* Price range (reference function)
	* Leisure center name

By the end of this stage we have the HTML and Layout for a card. 

#### Step 1

For Step 1, find the following line of code:

    $('#dc-data-grid').append("<h1>Hello world!</h1>");
    
This line of code is what is outputting "Hello world!" to the screen. 

Change this to say `Hello *your-name*`. 


	
>**_Explainer_** 
>
> Breaking this line of code down, it works as follows:
>
> Take the phrase:
>
>    `Hello world!` 
>
> Put in inside header tags to make it big and bold on our web page:
>
>    `<h1>Hello world!</h1>`
>
> An opening tag has a `<` and a `>` either side of the tag (in this case `h1`). To close the tag we need to add a `/`
>
> Append (add to) to the web-page inside the part of the webpage with ID dc-data-grid (as shown by the red text)
>
>    `$('#dc-data-grid').append("<h1>Hello world!</h1>");`
>
> Other things to remember:
>    1. If you open a quote or bracket, you have to close it again
>    2. All completed code statements end with `;`
>
    
Let's make it display the name of our first activity from our data object.

To do this we need to select the first session (item in the data object) from all sessions (items in the data object). 

Add this line above the one with your name in it:

    session = items[0];
    
As a simple example we are going to output the name of the session. 

The name of the session is contained in the `data.name` variable of the item. 

To display on the screen change the line with your name in to the following:

     $('#dc-data-grid').append("<h1>" + session.data.name + "</h1>");
 
Note here we have kept the `h1` tag in order to make it big and bold. Note that everything inside quotes is what get's output, thus to include a value from our data, we have to ensure we are not inside quotes and we use the `+` sign to join these outputs together.

**Time to test what you have learnt**

Try appending the session description inside paragraph `p` tags so it displays under the session name.

## Step 2 - Display details for more than one session

In this stage we are going to build what is known as an itterator. This itterator will loop through every session and displays the name and description of all the sessions in our dataset. 

To do this replace the line

    session = items[0];
    
with the following

    items.forEach(function(session) {
    
> **Explainer**
> 
> This line is similar to the one we have removed, it still contains `items` and `session`. We are using the `forEach` itterator to loop through the sessions. 
>

**Note**: We have unclosed brackets `(` and `{` as well as a missing end of code block charecter `;`

These closing brackets and code block charecter need to go after we have finised appending the session name and description to the screen. 

Add `)};` after your code lines that append name and description to the `#dc-data-grid`. 

The finished code block should look similar to the following:

    items.forEach(function(session) {
        $('#dc-data-grid').append('<h1>' + session.data.name + '</h1>');
        $('#dc-data-grid').append("...");
    });

> **Coding best practices**
>
> In order to make code more human readable it is a good convention to start a new line after every opening `{` and indent each line that follows (using tab or similar) prior to the closing `}`.
> 

## Step 3 - Starting to build the cross filter. 

[https://skyscanner.net](https://skyscanner.net) is a great example of a cross filter. Using this service you can apply filters to find flights. 

Our cross filter is going to be very similar but for sessions. The list of session we built above will be the list we want to filter. 

The first step of building our crossfilter is to create a list of sessions that can be filtered. 

To do this we need to use a few helper functions from the [dc.js](https://dc-js.github.io/dc.js/) library. 

> **What are code libraries?**
>
> Think of a code library as a set of pre-defined routines and functions that you can use to make your life easier.
> In this tutorial we are using 10 code libraries to help us:
> 
> `openactive-crossfilter helpers` - Built to support this tutorial, includes the data preprocessor as well as functions to extract data from OpenActive data.
>
> `jquery` - Streamlines javascript code (e.g. `$('#dc-data-grid').append('Hello world')` instead of `document.getElementById('dc-data-grid').appendChild(document.createTextNode("Hello world"));`
>
> `jquery-ui` - Visual elements for jquery
>
> `dc-js` - Javascript charting library
>
> `crossfilter` - Crossfilter extensions to dc-js
>
> `d3` - Data visualisation library
>
> `leaflet` - Open Street Map support
>
> `leaflet-markercluster` - Map markers and clustering support
>
> `dc.leaflet` - Integrates dc-js and leaflet for interactive maps
>
> `moment.js` - Library to handle dates, times and all funky formats they come in. 
>
> Without these libraries, the code in this tutorial would be thousands of lines long!
> You can find how these libraries are included in codePen by clicking the settings button and clicking `JS`.
> As many of the libraries also have associated visual style elements, we also have to include their own stylesheets. These can be found under the `CSS` section of settings in codePen.
>

>


Use the HTML and Javascript from above to populate the data grid with all 5 items.

https://codepen.io/davetaz/pen/OJPvgOK

## Step 3 - Create the activity row chart

https://codepen.io/davetaz/pen/ZEYxyxK

## Step 4 - Create a line chart of the duration

https://codepen.io/davetaz/pen/eYmMRjE

Maybe add duration to your cards??? 

## Step 4 - Create the search box

https://codepen.io/davetaz/pen/GRgxvYN


## Step 5 - Create the map

## Step 6 - Take the line chart for duration and turn it to a slider

## Step 7 - Make a rowChart for categories 

This requires all the reduceAdd bits etc.

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

Change this to say "Hello *your-name*" and you have done the hello world of making a web page.
	
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
    
Let's make it display the name of our first activity from our data object.

To do this we need to select the first session (item in the data object) from all sessions (items in the data object). Add this line above the one with your name in it:

    session = items[0];
    
As a simple example we are going to output the name of the session. The name of the session is contained in the `data.name` variable of the item. To display on the screen change the line with your name in to the following:

     $('#dc-data-grid').append("<h1>" + session.data.name + "</h1>");
 
Note here we have kept the `h1` tag in order to make it big and bold. Note that everything inside quotes is what get's output, thus to include a value from our data, we have to ensure we are not inside quotes and we use the `+` sign to join these outputs together.

*Time to test what you have learnt*

Try appending the session description inside paragraph `p` tags as well as the session name!

## Step 2 - Create the d3 data grid

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

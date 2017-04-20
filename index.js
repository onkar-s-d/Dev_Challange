/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false

const destination = "localhost:8011"
const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}


function connectCallback() {
	client.subscribe("/fx/prices", getResponse, {}); // get response from stomp server
}



var currency_array = [];
var sort_data = [];

function getResponse(message) { // callback function to process response data from stomp server 
	
	var currency_data = JSON.parse(message.body);
	
	var currency_data_table_row = document.getElementById('currency_row_'+currency_data.name);
	if(currency_data_table_row != null) {  
		update_currency_row(currency_data) // update currency row with existing currency value
	} else {
		add_currency_row(currency_data); // add new currency row if doesn't exist
	}
}

// To draw sparkline 
function drawspark(data,rowElement){ 
	var tableRow = document.getElementById(rowElement);
	var sparkline_data_array = []; // Need to work on this to get data array for each currency row, to draw sparkline accordingly
	
	sparkline_data_array.push((parseInt(tableRow.cells[1].innerHTML)+parseInt(tableRow.cells[1].innerHTML))/2); // push values to array with calculations
	

	var sparkline_data_cell = document.getElementById('sparkline_cell_'+data.name); // find for specific table cell to draw sparkline
	
	if(sparkline_data_cell != null) {
		var sparkElement = document.getElementById('sparkline_cell_'+data.name); // get table cell child element to draw sparkline
		
		if(sparkElement !=null){
			var sparkline = new Sparkline(sparkElement);
			sparkline.draw(sparkline_data_array); // sparkline draw function with array as input

		}
		
		
	}
}
  
// Function to add New currency row  
function add_currency_row(data) {
	
	var table = document.getElementById('currency_data_tbody');
	
	var new_currency_data_row = table.insertRow(table.rows.length);

	new_currency_data_row.setAttribute('id', ('currency_row_'+data.name));
	
	var cell1 = new_currency_data_row.insertCell(0);
	var cell2 = new_currency_data_row.insertCell(1);
	var cell3 = new_currency_data_row.insertCell(2);
	var cell4 = new_currency_data_row.insertCell(3);
	var cell5 = new_currency_data_row.insertCell(4);
	var cell6 = new_currency_data_row.insertCell(5);
	cell6.setAttribute("id",'sparkline_cell_'+data.name);
	
	cell1.innerHTML = data.name;
	cell2.innerHTML = data.bestBid;
	cell3.innerHTML = data.bestAsk;
	cell4.innerHTML = data.lastChangeBid;
	cell5.innerHTML = data.lastChangeAsk;
	cell6.innerHTML = "<span id='sparkline_cell_span_'"+data.name+"></span>"
	
	setTimeout(drawspark(data, ('currency_row_'+data.name)), 300); // Draw sparkline after 300ms lateron  we can change this to 30000ms i.e. 30s
	
	currency_array.push(data);
	
	sort_data = sortArray(currency_array, 'lastChangeBid'); // Sort currency table
	
	redraw_table(sort_data); // Re-Draw table after sorting 
}

// Function to Update currency row 
function update_currency_row(data) {

	var currency_row = document.getElementById('currency_row_'+data.name);
	
	currency_row.cells[1].innerHTML = data.bestBid;
	currency_row.cells[2].innerHTML = data.bestAsk;
	currency_row.cells[3].innerHTML = data.lastChangeBid;
	currency_row.cells[4].innerHTML = data.lastChangeAsk;
	
	for (var key in currency_array) {
		 if (key === data.name) currency_array['lastChangeBid'] = data.lastChangeBid;
	}
	setTimeout(drawspark(data, ('currency_row_'+data.name)), 300);
	sort_data = sortArray(currency_array, 'lastChangeBid');

	redraw_table(sort_data);

}

// Function to redraw cyrrency table rows 
function redraw_currency_row(data) {
	var currency_table = document.getElementById('currency_data_tbody');
	
	var currency_row = currency_table.insertRow(currency_table.rows.length);
	currency_row.setAttribute('id', ('currency_row_'+data.name));
	
	var cell1 = currency_row.insertCell(0);
	var cell2 = currency_row.insertCell(1);
	var cell3 = currency_row.insertCell(2);
	var cell4 = currency_row.insertCell(3);
	var cell5 = currency_row.insertCell(4);
	var cell6 = currency_row.insertCell(5);
	cell6.setAttribute("id",'sparkline_cell_'+data.name);

	cell1.innerHTML = data.name;
	cell2.innerHTML = data.bestBid;
	cell3.innerHTML = data.bestAsk;
	cell4.innerHTML = data.lastChangeBid;
	cell5.innerHTML = data.lastChangeAsk;
	cell6.innerHTML = "<span id='sparkline_cell_span_'"+data.name+"></span>"
	setTimeout(drawspark(data, ('currency_row_'+data.name)), 300);
}

// Function for sortng array based on 'lastChangeBid' key
function sortArray(array, field) {
	return array.sort(function(a,b) {
	  if (a[field] < b[field])
		return -1;
	  if (a[field] > b[field])
		return 1;
	  return 0;
	});
}

// Redraw table after sorting
function redraw_table(data){
	document.getElementById('currency_data_tbody').innerHTML = "";
	for(var index = 0; index < data.length; index++) {
		redraw_currency_row(data[index]);
	}

}

function subCallback(message) {
    var quote = JSON.parse(message.body);
    console.log(quotee.symbol + " is at " + quotee.value);
  }
client.connect({}, connectCallback, function(error) {
  alert(error.headers.message)
})

const exampleSparkline = document.getElementById('example-sparkline')
Sparkline.draw(exampleSparkline, [1, 2, 3, 6, 8, 20, 2, 2, 4, 2, 3])
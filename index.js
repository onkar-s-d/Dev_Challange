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
global.currencyArray = [];
global.sparklineDataArray = {};

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


function getResponse(message) { // callback function to process response data from stomp server 
	var currencyData = JSON.parse(message.body);
	currencyArray = checkForDuplicate(currencyArray,"name",currencyData); // Check for duplicate currency pair in our Array with response
	
	currencyArray = sortArray(currencyArray, 'lastChangeBid'); // Sort Array based on 'lastChangeBid' value
	drawCurrencyTable(currencyArray); // Draw Currency Table 
	
}

// Function to check duplicate currency in array
function checkForDuplicate(originalArray, objKey, newResData) {
	var tempIndex;
	var matchFound = false;
		
	if(originalArray.length > 0){
			for(var i = 0; i < originalArray.length; i++) {
			var key = newResData[objKey];
			if(originalArray[i][objKey] != key){
					matchFound = false;
			}
			else { 
			matchFound = true;
			tempIndex = i;
			break;}
		}
		if(matchFound){
			originalArray[tempIndex] = newResData;
			return originalArray;				
		}
		else {
			originalArray.push(newResData);
			return originalArray
		}
	}
	else {
		originalArray.push(newResData);
		return originalArray;
	}
}

// To draw sparkline 
function drawspark(data){

	for(i=0;i < data.length;i++){
		var tableRow = document.getElementById("currencyRow_"+data[i].name);
		
		if(sparklineDataArray[data[i].name] != undefined) {
		
			sparklineDataArray[data[i].name].push((parseFloat(tableRow.cells[1].innerHTML)+parseFloat(tableRow.cells[1].innerHTML))/2); // push values to array with calculations
		}
		else {		
				var bidPrice = parseFloat(tableRow.cells[2].innerHTML);
				var askPrice = parseFloat(tableRow.cells[1].innerHTML);
				var total =  (bidPrice + askPrice)/2;
				var valuArr = [];
				valuArr.push(total);
				sparklineDataArray[data[i].name] = valuArr;
		}
		
		var sparklineDataCell = document.getElementById('sparklineCell_'+data[i].name); // find for specific table cell to draw sparkline
		
		if(sparklineDataCell != null) {
			var sparkElement = document.getElementById('sparklineCell_'+data[i].name); // get table cell child element to draw sparkline
		
			if(sparkElement !=null){
				var sparkline = new Sparkline(sparkElement);
				sparkline.draw(sparklineDataArray[data[i].name]); // sparkline draw function with array as input

			}	
		}
	}

}

// Function to Draw currency table rows 
function drawCurrencyTable(data) {
	document.getElementById('currencyDataTbody').innerHTML = "";
	var currencyTable = document.getElementById('currencyDataTbody');
	
	for(i=0; i< data.length;i++){
		
		var currencyRow = currencyTable.insertRow(currencyTable.rows.length);
		currencyRow.setAttribute('id', ('currencyRow_'+data[i].name));
		
		var cell1 = currencyRow.insertCell(0);
		var cell2 = currencyRow.insertCell(1);
		var cell3 = currencyRow.insertCell(2);
		var cell4 = currencyRow.insertCell(3);
		var cell5 = currencyRow.insertCell(4);
		var cell6 = currencyRow.insertCell(5);
		cell6.setAttribute("id",'sparklineCell_'+data[i].name);

		cell1.innerHTML = data[i].name;
		cell2.innerHTML = data[i].bestBid;
		cell3.innerHTML = data[i].bestAsk;
		cell4.innerHTML = data[i].lastChangeBid;
		cell5.innerHTML = data[i].lastChangeAsk;
		cell6.innerHTML = "<span id='sparklineCellSpan_'"+data[i].name+"></span>";
		
	}
	setInterval(drawspark(data), 30000); // To Draw Sparkline
}

// Function for sorting array based on 'lastChangeBid' key
function sortArray(array, field) {
	return array.sort(function(a,b) {
	  if (a[field] < b[field])
		return -1;
	  if (a[field] > b[field])
		return 1;
	  return 0;
	});
}

function subCallback(message) {
    var quote = JSON.parse(message.body);
    console.log(quotee.symbol + " is at " + quotee.value);
}

client.connect({}, connectCallback, function(error) {
  alert(error.headers.message)
})

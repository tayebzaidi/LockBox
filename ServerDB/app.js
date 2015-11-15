console.log("Deploying node server...");

//Load dependencies
var http = require('http');
var express = require('express');
var mysql = require('mysql');
var fs = require('fs');
var util = require('util');
var validator = require('validator');

try {
	var queryString = require('querystring'); //Linux
} catch(exception) {
	var queryString = require('queryString'); //Windows
}

//Connect to server
var conn = connectToDatabase();
conn.connect(function(error) {
	if(error) { console.log("Unable to connect to database"); }
	else      { console.log("Connected to database"); }
})

//Begin event loop
//var server = http.createServer(requestHandler);
//server.listen(1337);
var app = express();
app.use('/', express.static(__dirname + '/../public'));
app.post('/lockbox/node', requestHandler);

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
})

console.log("Express Node server deployed.");

//recalculateAverages();

//Main Request Handler
function requestHandler(req, res) {
	console.log("Request recieved.");
	if(req.method == "GET") {
		res.end("No GET functions used.");
		return;
	} else if(req.method == "POST") {
		req.on('data', function(chunk) { processData(chunk, req, res); });
	} else {
		console.log('User attempted method: ' + req.method);
		res.end('Request method not used.');
	}
}

//Proess data sent with request
function processData(chunk, req, res) {
	//Transform data to json. 
	try {
		var data = JSON.parse(chunk.toString());
	} catch (execption) {
		var data = JSON.parse(chunk);
	}
	
	//Function must be provided
	if(data.function == undefined) {
		res.end(JSON.stringify({'success' : false, 'error' : "no function given"}));
		return;
	}
	
	//Pass request to proper method
	switch(data.function) {
		case('insert'):
			insertData(data, req, res);
			break;
		case('raw'):
			retrieveData(data, req, res);
			break;
		case('averages'):
			retrieveDataAverages(data, req, res);
			break;
		case('averageSleep'):
			retrieveAverageHours(data, req, res);
			break;
		default:
			res.end(JSON.stringify({'success': false, 'error' : "invalid function"}));
			break;
	}
}

//Required values to insert data
var requiredForInsert = ['college','waketime','bedtime'];

//Insert one day of sleep information into the database
function insertData(data, req, res) {
	if(!isRequiredSet(data, requiredForInsert)) {
		replyMissingInputs(res);
		return;
	}
	
	var insertQuery = util.format("INSERT INTO sleepdata (`date_before_bed`, `bedtime`, `waketime`, `college`)" +
				 "VALUES ('%s','%s','%s','%s')",data.date, data.bedtime, data.waketime, data.college);
	console.log(insertQuery);
	conn.query(insertQuery, function(error, rows, fields) {
		if(error) {
			console.log("Error inputting data: " + error);
			console.log("Data sent: " + data.toString());
			replyErrorRetrievingData(res);
		} else {
			console.log(data.college);
			res.end(JSON.stringify(rows));
			updateAverages(data.college, data.date, data.bedtime, data.waketime);
		}
	});
}
	
	

//Required values to retrieve data in range
var requiredForRetrieve = ['college','startDate','endDate'];

//Retrieve all data points in range for one school
function retrieveData(data, req, res) {
	if(!isRequiredSet(data, requiredForRetrieve)) {
		replyMissingInputs(res);
		return;
	}
	//validate 'college', 'startDate', 'endDate' by escaping
    var sanitizeCollege = validator.escape(data.college);
    var sanitizeStartDate = validator.escape(data.startDate);
    var sanitizeEndDate = validator.escape(data.endDate);

	var query = "SELECT `date_before_bed`, `bedtime`, `waketime` FROM `sleepdata` WHERE `college` = '" + data.college + 
				"' AND `date_before_bed` > '" + data.startDate + 
				"' AND `date_before_bed` < '" + data.endDate + "';";
	conn.query(query, function(error, rows, fields) {
		if(error) {
			console.log("Error retrieving data");
			console.log("Data sent: " + data);
			replyErrorRetrievingData(res);
		} else {
			console.log(rows);
			res.end(JSON.stringify({'success':true, 'rows':rows}));
		}
	});
}

//Required values to retrieve data in range
var requiredForRetrieveAverages = ['college','startDate','endDate'];
//Retrieve all data points in range for one school
function retrieveDataAverages(data, req, res) {
	if(isRequiredSet(data, requiredForRetrieve)) {
		replyMissingInputs(res);
		return;
	}
	
	var query = "SELECT `date_before_bed`, `bedtime`, `waketime` FROM `dayaverages` WHERE `college` = '" + data.college + 
				"' AND `date_before_bed` > '" + data.startDate + 
				"' AND `date_before_bed` < '" + data.endDate + "';";
	conn.query(query, function(error, rows, fields) {
		if(error) {
			console.log("Error retrieving data");
			console.log("Data sent: " + data);
			replyErrorRetrievingData(res);
		} else {
			res.end(JSON.stringify({'success':true, 'rows':rows}));
		}
	});
}




//---- Utility Functions -----
function isRequiredSet(data, required) {
	for(var i =0; i < required.length; i++) {
		if(data[required[i]] === undefined) {
			return false;
		}
	}
	return true; 
} 

function connectToDatabase() {
	var connection = mysql.createConnection({
  		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'sleepbox'
	});
	return connection;
}

function replyMissingInputs(res) {
	res.end('{"success":false, "error":"missing required input"}');
}

function replyErrorRetrievingData(res) {
	res.end('{"success":false, "error":"error retrieving data from database"}');
}

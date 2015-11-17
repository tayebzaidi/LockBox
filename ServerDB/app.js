console.log("Deploying node server...");

//Load dependencies
var http = require('http');
var express = require('express');
var fs = require('fs');
var util = require('util');
var validator = require('validator');
var dal = require('./dal');

//Start event loop
var app = express();
app.use('/', express.static(__dirname + '/../public'));
app.post('/lockbox/node', requestHandler);

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Server hosted at %s:%s", host, port);
})

console.log("Express Node server deployed.");


/**
 * Handles requests made to the server. 
 * Passes all POST requests to processData
 * @param <ServerRequest> req
 * @param <ServerResponse> res
 */
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

/**
 * Processes data from a request. Probably incorrect at this point. 
 * Should handle the fact that data comes in via chunking. At this point
 * it is assuming that the whole request is in the chunk. Only post requests.
 * @param <Object> chunk
 * @param <ServerRequest> req
 * @param <ServerResponse> res
 */
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

/**
 * Handles a request to insert one data point for a school.
 * Verifies request, pulls information from data object. 
 * Replies to the request with the success or an error. 
 * @param <Object> data - Data from request
 * @param <ServerRequest> req - Request object from request
 * @param <ServerResponse> res - Response object form request
 */
function insertData(data, req, res) {
	if(!isRequiredSet(data, requiredForInsert)) {
		replyMissingInputs(res);
		return;
	}

	dal.insertData(data.college, data.bedDateTime, data.wakeDateTime, function(error, rows, fields) {
		if(error) {
			replyErrorRetrievingData(res);
		} else {
			res.end('{success : true, response : "data stored" }');
		}
	});
}
	
//Required values to retrieve data in range
var requiredForRetrieve = ['college','startDate','endDate'];

/**
 * Handles a request for all data in date range for one school. 
 * Verifies request, pulls information from data object. 
 * Replies to the request with the data or an error. 
 * @param <Object> data - Data from request
 * @param <ServerRequest> req - Request object from request
 * @param <ServerResponse> res - Response object form request
 */
function retrieveData(data, req, res) {
	if(!isRequiredSet(data, requiredForRetrieve)) {
		replyMissingInputs(res);
		return;
	}

	dal.retrieveData(data.college, data.startDate, data.endDate, function(error, rows, fields) {
		if(error) {
			replyErrorRetrievingData(res);
		} else {
			res.end(JSON.stringify({'success':true, 'rows':rows}));
		}
	});
}

//Required values to retrieve data in range
var requiredForRetrieveAverages = ['college','startDate','endDate'];

/**
 * Handles a request for data averages in date range for one school. 
 * Verifies request, pulls information from data object. 
 * Replies to the request with the data or an error. 
 * @param <Object> data - Data from request
 * @param <ServerRequest> req - Request object from request
 * @param <ServerResponse> res - Response object form request
 */
function retrieveDataAverages(data, req, res) {
	if(isRequiredSet(data, requiredForRetrieve)) {
		replyMissingInputs(res);
		return;
	}
	
	dal.retrieveDataAverages(data.college, data.startDate, data.endDate, function(error, rows, fields) {
		if(error) {
			replyErrorRetrievingData(res);
		} else {
			res.end(JSON.stringify({'success':true, 'rows':rows}));
		}
	});
}




//------ Utility Functions -------

/**
 * Checks to see if the required values are present in the data object.
 * Intended use for checking data objects from the client.
 * @param <Object> data
 * @param <Array> required
 * @return <Boolean>
 */
function isRequiredSet(data, required) {
	for(var i =0; i < required.length; i++) {
		if(data[required[i]] === undefined) {
			return false;
		}
	}
	return true; 
} 

/**
 * Replies to the given request with missing input error.
 * @param <ServerResponse> res
 */
function replyMissingInputs(res) {
	res.end('{"success":false, "error":"missing required input"}');
}

/**
 * Replies to the given request with database error. 
 * @param <ServerResponse> res
 */
function replyErrorRetrievingData(res) {
	res.end('{"success":false, "error":"error retrieving data from database"}');
}

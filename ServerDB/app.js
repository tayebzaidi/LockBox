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
app.use('/', express.static(__dirname + '../public'));
app.post('/node', requestHandler);

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
})
express.listen(3000);
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
	conn.query(insertQuery, function(error, rows, fields) {
		if(error) {
			console.log("Error inputting data");
			console.log("Data sent: " + data);
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

var requiredForAverageHours = ['college', 'startDate','endDate'];
function retrieveAverageHours(data, req, res) {
	if(!isRequiredSet(data, requiredForAverageHours)) {
		replyMissingInputs(res);
		return;
	}
	
	var query = "SELECT `date_before_bed`, `average_sleep` FROM `dayaverages` WHERE `college` = '" + data.college + "' AND `date_before_bed` >= '" + data.startDate + "' AND `date_before_bed` <= '" + data.endDate + "';";
	conn.query(query, function(error, rows, fields) {
		if(error) {
			console.log("SELECT Error: " + error);
			replyErrorRetrievingData(res);
			return;
		}
		res.end(JSON.stringify({'success':true, 'rows':rows}));
	});
}


//College is string, date is datestring, bedtime is timestring, waketime is timestring
function updateAverages(college, date, bedtime, waketime, callback) {
	console.log("Updating Averages");
	if(typeof(date) !== "string") {
		date = dateTimeToDateString(date);
	}
	var selectQuery = "SELECT `average_sleep`, `average_bedtime`, `average_waketime`, `count` FROM `dayaverages` WHERE `college` = '" + college + "' AND `date_before_bed` = '" + date + "' LIMIT 1";
	conn.query(selectQuery, function(error, rows, fields) {
		if(error) {
			console.log("Select in update error: " + error);
			return;
		}
		var sleptTime = getTimeSlept(bedtime, waketime);
		console.log(rows.length);
		if(rows.length == 0) {
			var insertQuery = "INSERT INTO `dayaverages` (`college`, `date_before_bed`, `average_sleep`, `average_bedtime`, `average_waketime`, `count`) VALUES ('" + college + "', '" + date + "','" + sleptTime + "','" + bedtime + "','" + waketime + "','" + 1 + "');"
			conn.query(insertQuery, function(error, rows, fields) {
				if(error) {
					console.log("Error adding new day averages");
					console.log(error);
				}
				if(callback) {
					callback();
				}
			});
		} else {
			var averageSleep = minutesFromTimeString(rows[0]['average_sleep']);
			var averageBedtime = rows[0]['average_bedtime'];
			var averageWaketime = rows[0]['average_waketime'];
			var count = rows[0]['count'];
			
			var newAverageSleep = (averageSleep * count + timeStringToMinutes(sleptTime)) / (count + 1);
			var newAverageBedtime = "08:30:00";
			var newAverageWaketime = "07:30:00";
			
			var updateQuery = "UPDATE `dayaverages` SET `average_bedtime` = '" + newAverageSleep + "', `average_bedtime` = '" + newAverageBedtime + "', `average_waketime` = '" + newAverageWaketime + "' WHERE `college` = '" + college + "' AND `date_before_bed` = '" + date + "' LIMIT 1";
			conn.query(updateQuery, function(error, rows, fields) {
				if(error)
				{
					console.log("Error updating dayaverages");
					console.log(error);
				}
				if(callback) {
					callback();
				}
			});
		}
	});	
}

function recalculateAverages() {
	var query = "SELECT * FROM `sleepdata` WHERE -1";
	conn.query(query, function(error, rows, fields) {
		if(error) {
			console.log(error);
			return;
		}
		
		recalculateAveragesCallback(rows, 0);
	});
}

function recalculateAveragesCallback(rows, i) {
	console.log(rows.length);
	if(i >= rows.length) {
		return;
	}
	var college = rows[i]['college'];
	var dateBeforeBed = dateTimeToDateString(rows[i]['date_before_bed']);
	var bedtime = rows[i]['bedtime'];
	var waketime = rows[i]['waketime'];
	updateAverages(college, dateBeforeBed, bedtime, waketime, function() { recalculateAveragesCallback(rows, i+1) });
}

function dateTimeToDateString(dateTime) {
	return "" + dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + dateTime.getDate();
}
function dateTimeToTimeString(dateTime) {
	return "" + dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
}

function dateTimeToMinutes(dateTime) {
	return dateTime.getHours() * 60 + dateTime.getMinutes();
}

function timeStringToMinutes(timeString) {
	var tokens = timeString.split(':');
	return parseInt(tokens[0]) * 60 +  parseInt(tokens[1]);
}

function hourFromTimeString(timeString) {
	var tokens = timeString.split(':');
	return parseInt(tokens[0]);
}

function minutesFromTimeString(timeString) {
	var tokens = timeString.split(':');
	return parseInt(tokens[1]);
}

function createTimeString(hours, minutes, seconds) {
	return "" + hours + ":" + minutes + ":" + seconds;
}

//Just get the hours and minutes for SQL query
function getTimeSlept(bedtime, waketime) {
	var bedMinutes = timeStringToMinutes(bedtime);
	if(hourFromTimeString(bedtime) < 13)
		bedMinutes += 1440;
		
	var wakeMinutes = timeStringToMinutes(waketime) + 1440;

	var sleptHoursDecimal = (wakeMinutes - bedMinutes) / 60;
	var sleptHours = Math.floor(sleptHoursDecimal);
	var sleptMinutes = (sleptHoursDecimal - sleptHours) * 60;
	return createTimeString(sleptHours, sleptMinutes, 0);
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
		password : 'strangehat',
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

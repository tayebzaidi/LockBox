var http = require('http');
var server = http.createServer(requestHandler);
var mysql = require('mysql');
var conn = connectToDatabase();
//var queryString = require(queryString);

conn.connect(function(error) {
	if(error) { console.log("Unable to connect to database"); }
	else	  { console.log("Connected to database"); }
});
server.listen(1337);

function requestHandler(req, res) {
	console.log("Someone connected");
	console.log(req);
	if(req.method != "POST")
		res.end("Error: Invalid request method")
	switch(req.url) {
		case('/retreive'):
			req.on('data', function(chunk) { retrieveData(chunk, req, res); });
			retrieveData(req, res);
		default:
			res.end("Error");
	}
}

var requiredForRetrieve = ['college','startDate','endDate'];
function retrieveData(chunk, req, res) {
	var data = JSON.parse(chunk.toString());
	if(isRequiredSet(data, requiredForRetrieve)) {
		replyMissingInputs(res);
		return;
	}
	
	var query = "SELECT `date_before_bed`, `bedtime`, `waketime` FROM `sleepdata` WHERE `college` = '" + data.college + 
				"' AND `date_before_bed` > '" + data.startDate + 
				"' AND `date_before_bed` < '" + data.endDate + "';";
	conn.query(query, function(error, rows, fields) {
		if(error) {
			console.log("Error retrieving data");
			console.log("Data sent: " + data);
			replyErrorRetrieveingData(res);
		} else {
			res.end(JSON.stringify(rows));
		}
	});
}

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

function replyErrorRetrieveingData(res) {
	res.end('{"success":false, "error":"error retrieving data from database"}');
}
console.log("Hello!");
var http = require('http');
//var mysql = require('mysql');
var http = require('http');
var server = http.createServer(requestHandler);
var mysql = require('mysql');
var conn = connectToDatabase();
try {
	var queryString = require('querystring');
} catch(exception) {
	var queryString = require('queryString');
}
conn.connect(function(error) {
	if(error) { console.log("Unable to connect to database"); }
	else      { console.log("Connected to database"); }
})
server.listen(8080);

function requestHandler(req, res) {
	console.log("Someone connected");
	if(req.method != "POST") {
		res.end("Error: Invalid request method");
		return;
	}
	switch(req.url) {
		case('/retrieve'):
			req.on('data', function(chunk) { retrieveData(chunk, req, res); });
			break;
		case('/insert'):
			req.on('data', function(chunk) { insertData(chunk, req, res); });
			break;
		default:
			console.log("Client error connecting")
			res.end("Error");
			break;
	}
}

//Required values to retrieve data in range
var requiredForRetrieve = ['college','startDate','endDate'];
//Retrieve all data points in range for one school
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
			replyErrorRetrievingData(res);
		} else {
			res.end(JSON.stringify(rows));
		}
	});
}

function insertData(chunk, req, res) {
	console.log(req.method);
	var data = JSON.parse(chunk);
	if(isRequiredSet(data, requiredForRetrieve)) {
		replyMissingInputs(res);
		return;
	}
	
	var insertQuery = "INSERT INTO sleepdata (`date_before_bed`, `bedtime`, `waketime`, `college`)" +
				 "VALUES ('" + data.date + "','" + data.bedtime + "','" + data.waketime + "','" + data.college + "')"
	conn.query(insertQuery, function(error, rows, fields) {
		if(error) {
			console.log("Error inputting data");
			console.log("Data sent: " + data);
			replyErrorRetrievingData(res);
		} else {
			console.log(data.college);
			res.end(JSON.stringify(rows));
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

/*
	
	if(req.method === "POST") {
		console.log("Post");
		console.log(req);
		
		
		req.on('data', function (chunk) {
			
			//console.log("Body: " + body);
			var data = JSON.parse(chunk.toString());
			console.log(data);
			//if(data.college) {
			
			//var query = "INSERT INTO sleepdata (date_before_bed, bedtime, waketime, college)"
			//			+ "VALUES ('" + data.dateBeforeBed + "''" + data.bedtime + "''" + data.waketime + "''" + data.college "')"
			//} else {
			//	console.log('Invalid JSON')
			//}
		});
		
		req.on('end', function() {
			res.writeHead(200, {
				'Content-Type': 'text/html'
			});
			res.end('post received');
		});
		
		res.end('post received');
	} else {
		console.log("Not Post");
	}
	res.end();
}).listen(8080);

/*
var fs = require('fs');
fs.writeFile("./test","Hey there!", function(err) {
	if(err) {
		return console.log(err);
	}
	console.log("The file was saved!")
})
*/

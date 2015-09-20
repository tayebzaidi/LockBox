console.log("Hello!");
var http = require('http');
var server = http.createServer(requestHandler);
var mysql = require('mysql');
var conn = connectToDatabase();
var fs = require('fs');

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

//Main Request Handler
function requestHandler(req, res) {
	console.log("Someone connected");
	if(req.method == "GET") {
		serveFile(req, res);
		return;
	} else if(req.method == "POST") {
		switch(req.url) {
			case('/raw'):
				req.on('data', function(chunk) { retrieveData(chunk, req, res); });
				break;
			case('/averages'):
				req.on('data', function(chunk) { retrieveDataAverages(chunk, req, res); });
				break;
			case('/insert'):
				req.on('data', function(chunk) { insertData(chunk, req, res); });
				break;
			default:
				console.log("Client error connecting")
				res.end("Error");
				break;
		}
	} else {
		console.log('Request method not found');
		res.end('Error: Request method not found');
	}
}

function serveFile(req, res) {
	if(req.url.indexOf('.html') != -1) {
		serveHTML(req, res);
	} else if(req.url.indexOf('.js') != -1) {
		fs.readFile('/js/main.js', function (err, data) {
		if(err) console.log(err);
		res.writeHead(200, {'Content-Type': 'text/javascript'});
    	res.write(data);
    	res.end();
		});
	} else if(req.url.indexOf('.css') != -1) {
		fs.readFile('/css/style.css', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });
	} else {
		console.log('Error: Request not found for client');
		res.end('Error: Request not found');
	};
}

function serveHTML(req, res) {
	fs.readFile('index.html', function (err, data) {
    	if (err) {
     		res.writeHead(500);
      		return res.end('Error loading index.html');
    	}

    	res.writeHead(200);
    	res.end(data);
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

//Required values to retrieve data in range
var requiredForRetrieveAverages = ['college','startDate','endDate'];
//Retrieve all data points in range for one school
function retrieveDataAverages(chunk, req, res) {
	var data = JSON.parse(chunk.toString());
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
			res.end(JSON.stringify(rows));
		}
	});
}


//College is string, date is datestring, bedtime is timestring, waketime is timestring
function updateAverages(college, date, bedtime, waketime) {
	var selectQuery = "SELECT `average_sleep`, `average_bedtime`, `average_waketime`, `count` FROM `dayaverages` WHERE `college` = '" + college + "' AND `date_before_bed` = '" + date + "' LIMIT 1";
	conn.query(selectQuery, function(error, rows, fields) {
		var sleptTime = getTimeSlept(bedtime, waketime);
		if(rows.length == 0) {
			var insertQuery = "INSERT INTO `dayaverages` (`college`, `date_before_bed`, `average_sleep`, `average_bedtime`, `average_waketime`, `count`) VALUES ('" + college + "', '" + date + "','" + dateTimeToTimeString(sleptTime) + "','" + bedtime + "','" + waketime + "');"
			conn.query(insertQuery, function(error, rows, fields) {
				if(error) {
					console.log("Error adding new day averages");
					console.log(error);
				}
			});
		} else {
			var averageSleep = minutesFromTimeString(rows[0]['average_sleep']);
			var averageBedtime = rows[0]['average_bedtime'];
			var averageWaketime = rows[0]['average_waketime'];
			var count = rows[0]['count'];
			
			var newAverageSleep = (averageSleep * count + dateTimeToMinutes(sleptTime)) / (count + 1);
			var newAverageBedtime = "08:30:00";
			var newAverageWaketime = "07:30:00";
			
			var updateQuery = "UPDATE `dayaverages` SET `average_bedtime` = '" + newAverageSleep + "', `average_bedtime` = '" + newAverageBedtime + "', `average_waketime` = '" + newAverageWaketime + "' WHERE `college` = '" + college + "' AND `date_before_bed` = '" + date + "' LIMIT 1";
			conn.query(updateQuery, function(error, rows, fields) {
				if(error)
				{
					console.log("Error updating dayaverages");
					console.log(error);
				}
			});
		}
	});	
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

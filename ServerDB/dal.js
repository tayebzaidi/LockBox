module.export = {
	retrieveData : retrieveData,
	retrieveDataAverages : retrieveDataAverages,
	insertData : insertData
}

var mysql = require('mysql');
var util = require('util');

//Connect to database
var conn = connectToDatabase();
conn.connect(function(error) {
	if(error) { console.log("Unable to connect to database"); }
	else      { console.log("Connected to database"); }
})

function connectToDatabase() {
	var connection = mysql.createConnection({
  		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'sleepbox'
	});
	return connection;
}


//Retrieve all data points in range for one school
function retrieveData(college, startDate, endDate, callback) {
	var query = util.format("SELECT `date_before_bed`, `bedtime`, `waketime` FROM `sleepdata` WHERE `college` = '%s' AND `date_before_bed` > '%s' AND `date_before_bed` < '%s';",
							college, startDate, endDate);
	conn.query(query, function(error, rows, fields) {
		if(error) {
			console.log("Error retrieving all data in range from DB");
			console.log("Query: " + query);
			console.log(util.format("Data sent - college : '%s', startDate : '%s', endDate : '%s'", college, startDate, endDate));
			console.log(error);
		} 
		callback(error, rows, fields);
	});
}

//Retrieve all data points in range for one school
function retrieveDataAverages(college, startDate, endDate, callback) {
	var query = util.format("SELECT `date_before_bed`, `bedtime`, `waketime` FROM `dayaverages` WHERE `college` = '%s' AND `date_before_bed` > '%s' AND `date_before_bed` < '%s';", 
							college, startDate, endDate);
	conn.query(query, function(error, rows, fields) {
		if(error) {
			console.log("Error retrieving data averages in range from DB");
			console.log("Query: " + query);
			console.log(util.format("Data sent - college : '%s', startDate : '%s', endDate : '%s'", college, startDate, endDate));
		}
		callback(error, rows, fields);
	});
}

//Insert one day of sleep information into the database
function insertData(college, bedDateTime, wakeDateTime, req, res, callback) {
	var query = util.format("INSERT INTO sleepdata (`college`, `bed_datetime`, `wake_datetime`) VALUES ('%s','%s','%s','%s')", college, bedDateTime, wakeDateTime);

	conn.query(query, function(error, rows, fields) {
		if(error) {
			console.log("Error inserting data into DB");
			console.log("Query: " + query);
			console.log("Data sent - college : %s, bedDateTime : %s, wakeDateTime : %s", college, bedDateTime, wakeDateTime);
			callback(error, rows, fields);
		} else {
			callback(error, rows, fields);
			//TODO update averages
		}
	});
}
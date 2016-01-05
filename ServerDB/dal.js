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

/**
 * Connects to the SleepEasy database.
 */
function connectToDatabase() {
	var connection = mysql.createConnection({
  		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'sleepbox'
	});
	return connection;
}


/**
 * Retrieves all of the data points for the given college in the date range
 * Triggers the callback with error, rows, and fields from query. 
 * @param {String} college
 * @param {DateTime} startDate
 * @param {DateTime} endDate
 * @param {Function} callback
 */
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

/**
 * Retrieves sleep averages for given college in the date range.
 * Triggers callback on finish with error, rows, and fields from query.
 * @param {String} college
 * @param {DateTime} startDate
 * @param {DateTime} endDate
 * @param {Function} callback
 */
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

/**
 * Inserts one data point for the given college.
 * Applied to date corresponding to time at midpoint of bed and wake. 
 * 12 pm to 12 am apply to date at 12 pm. 
 * Triggers callback on finish with error.
 * @param {String} college
 * @param {DateTime} bedDateTime
 * @param {DateTime} wakeDateTime
 * @param {Function} callback
 */
function insertData(college, bedDateTime, wakeDateTime, callback) {
	var query = util.format("INSERT INTO sleepdata (`college`, `bed_datetime`, `wake_datetime`) VALUES ('%s','%s','%s','%s')", college, bedDateTime, wakeDateTime);

	conn.query(query, function(error, rows, fields) {
		if(error) {
			console.log("Error inserting data into DB");
			console.log("Query: " + query);
			console.log("Data sent - college : %s, bedDateTime : %s, wakeDateTime : %s", college, bedDateTime, wakeDateTime);
			callback(error);
		} else {
			callback(error);
			//TODO update averages
		}
	});
}

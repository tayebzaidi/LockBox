var mysql = require('mysql');
var fs = require('fs');
var conn = connectToDatabase();

conn.connect(function(error) {
	if(error) { console.log("Unable to connect to databse"); }
	else { console.log("Connected to database"); }
});

var filePath = "sleepeasy.csv";
fs.readFile(filePath, function (err, data) {
	var bufferString = data.toString();
	var bufferStringSplit = bufferString.split('\n');
	for (var i=0; i< bufferStringSplit.length; i = i+1) {
		console.log(bufferStringSplit[i]);	
		var tokens = bufferStringSplit[i].split('"').join("").split('\r').join('').split(',');
		console.log(tokens);
		var query = "INSERT INTO `sleepdata` (`college`, `date_before_bed`, `bedtime`, `waketime`) VALUES ('Macalester College', '" + tokens[1] + "', '" + tokens[2] + ":00', '" + tokens[3] + ":00');";
		console.log(query);
		conn.query(query, function(err, rows, doodle) {
			
		});
	}
});

 function connectToDatabase() {
	var connection = mysql.createConnection({
  		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'sleepbox'
	});
	return connection;
}
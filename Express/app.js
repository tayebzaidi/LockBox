var express = require('express');
var app = express();
app.get('/dog', function(req, res) {
	res.end("<h1> DOG </h1>");
});

app.use('/', express.static(__dirname + "/public"));

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Example app listening at http://%s:%s', host, port);
})
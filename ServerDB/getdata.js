var http = require('http');
var server = http.createServer(requestHandler);
server.listen(1337);

function requestHandler(req, res) {
	switch(req.url) {
		case('/retreive'):
			res.end("Retrieving data");
		default:
			res.end("Error");
	}
}
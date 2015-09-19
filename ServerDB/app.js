console.log("Hello!");
var http = require('http');
http.createServer(function (request, response) {
	response.writeHead(200, {
		'Content-Type': 'text/plain'
	response.write('Message Received!')
	});
	response.end();
}).listen(8080);


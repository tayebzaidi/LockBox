console.log("Hello!");
var http = require('http');

http.createServer(function (req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/plain'
	});
	res.write('Message Received!');
	//res.end();
	
	if(req.method === "POST") {
		console.log("Post");
		body = '';
		req.on('data', function (data) {
			body += data;
			console.log("Partial body: " + body);
		});
		req.on('end', function () {
			console.log("Body: " + body);
		})
		res.writeHead(200, {
			'Content-Type': 'text/html'
		})
		res.end('post received');
	} else {
		console.log("Not Post");
	}
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
var http = require('http');
var fs = require('fs');

var handleRequest = function (req, res){
	if(req.url=="/")
		res.end(fs.readFileSync("./index.html"))
	
	else if(req.url!='/favicon.ico')
		res.end(fs.readFileSync('.'+req.url));
	
	// res.end(fs.readFileSync(req.url));
}

var server = http.createServer(handleRequest);

server.listen(8000);
console.log('server connected.....')
var fs = require('fs');
var querystring = require('querystring');
var comments = require('./comments.js');

var template = fs.readFileSync('./templates/guestBook.html', 'utf8');
var method_not_allowed = function(req, res){
	res.statusCode = 405;
	console.log(res.statusCode);
	res.end('Method is not allowed');
};
var renderGuestBook = function(req, res){
	res.end(template.replace(/__COMMENTS_TABLE__/, comments.generateTable()));
};
var getComments = function(req,res){
	res.end(JSON.stringify(comments.getAll()));
};
var postGuestComment = function(req, res){
	// debugger;
	var data = '';
	req.on('data', function(chunk){
		data += chunk;
	});
	req.on('end', function(){
		console.log(data);
		var entry = querystring.parse(data);
		comments.add(entry);
		getComments(req,res);
	});
};

var serveIndex = function(req, res, next){
	req.url = '/index.html';
	next();
};
var serveStaticFile = function(req, res, next){
	var filePath = './public' + req.url;
	fs.readFile(filePath, function(err, data){
		if(data){
			res.statusCode = 200;
			console.log(res.statusCode);
			res.end(data);
		}
		else{
			next();
		}
	});
};
var fileNotFound = function(req, res){
	res.statusCode = 404;
	res.end('Not Found');
	console.log(res.statusCode);
};
var redirectToGuestPage = function(req, res){
	res.writeHead(302, {Location: '/guestBook'});
	res.end();
};

exports.post_handlers = [
	{path: '^/comment$', handler: postGuestComment},
	{path: '', handler: method_not_allowed}
];
exports.get_handlers = [
	{path: '^/$', handler: serveIndex},
	{path: '^/ghost$', handler: redirectToGuestPage},
	{path: '^/guestBook$', handler: renderGuestBook},
	{path: '^/comments$' , handler: getComments},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];


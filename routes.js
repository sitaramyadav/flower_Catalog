var fs = require('fs');
var querystring = require('querystring');
var pg=require('pg');
var connectionString="postgres://postgres:anu$147#@localhost:5000/newflower";
var toRow = function(entry){
	return ['<tr>','<td>',entry.name, '</td>','<td>', entry.comments, '</td>','</tr>'].join(' ');
};
var generateTable = function(comments){
	console.log('comments',comments,'comments');
	return '<table><tr><th>Time</th><th>Name</th><th>Comment</th></tr>' + comments.map(toRow).join(' ') + '</table>';
};

var template = fs.readFileSync('./Public/guestBook.html', 'utf8');
var method_not_allowed = function(req, res){
	res.statusCode = 405;
	console.log(res.statusCode);
	res.end('Method is not allowed');
};
var renderGuestBook = function(req, res){
	var resultToOut=[];
	var connectionString="postgres://postgres:seetaram@localhost:5000/newflower";
		pg.connect(connectionString,function(err,client,done){
			if(err) return console.log(err,'err');
				var query=client.query("select *from flowerCatalog");
				query.on('row',function(row){
					console.log('row',row,'row');
					resultToOut.push(row);
				})
				query.on('end',function(){
					client.end();
					console.log('(resultToOut.rows)',(resultToOut),'(resultToOut.rows)');
					res.end(template.replace(/__COMMENTS_TABLE__/,generateTable(resultToOut)));
				})
			})
};
var getComments = function(req,res){
	var resultToOut=[];
	var connectionString="postgres://postgres:seetaram@localhost:5000/newflower";
		pg.connect(connectionString,function(err,client,done){
			if(err) return console.log(err,'err');
				var query=client.query("select *from flowerCatalog");
				query.on('row',function(row){
					resultToOut.push(row);
				})
				query.on('end',function(){
					client.end();
				res.end(JSON.stringify(resultToOut.rows));
				})
			})
};

var insertInfoIntoDatabase = function(nam,coment){
	var arr = ['\''+nam+'\'','\''+coment+'\''];
	var connectionString="postgres://postgres:seetaram@localhost:5000/newflower";
	pg.connect(connectionString,function(err,client,done){
		if(err) return console.log('error',err);
		client.query("insert into flowerCatalog (name,comments) values ("+arr.join(',')+")",function(err,result){
			if(err) console.log(err,'err');
			done();
		})
	})
};

var postGuestComment = function(req, res){
	var data = '';
	req.on('data', function(chunk){
		data += chunk;
	});
	req.on('end', function(){
		console.log(data);
		var entry = querystring.parse(data);
		insertInfoIntoDatabase(entry.name,entry.comment);
	
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


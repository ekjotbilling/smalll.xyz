var express = require('express');
var bodyParser=require('body-parser');
var mysql = require('mysql');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/:tiny', function(req, res){
	connection.query('select geturl(?) as complete;',req.params.tiny, function(err, rows) {
		if(err) throw err;
		res.redirect(rows[0].complete);
	});
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

app.post('/addurl', function(req, res){
	var tiny = req.body.tiny;
	var complete = req.body.complete;

	if(tiny && complete){
		connection.query('call addurl(?, ?);',[tiny, complete], function(err, rows, fields) {
			if(err) res.send('Something went wrong.\nMost likely smalll.xyz/'+tiny+' is already taken.');
			else res.send('URL shortcut added.\nsmalll.xyz/'+tiny+' should redirect you to '+complete);
		});
	}
});

var connection = mysql.createConnection({
	host		: process.env.DB_host,
	user		: process.env.DB_user,
	password	: process.env.DB_pass,
	database	: process.env.DB_name
});

connection.connect(function(err){
	if(err) throw err;
	console.log("Connected");
});

const port = 1337;
app.listen(port, function(){
	console.log('server listeneing on port ' + port);
});

// connection.end();
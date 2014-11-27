var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serialport = require('serialport'); // include the library
//var servi = require('servi');
var request = require('request');
var url = require("url");
app.set('views', __dirname + '/views');
app.set('public', __dirname + '/public');
http.listen(3100, function(){
	  console.log('listening on *:3100');
	});

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'fooddata',
});
connection.connect();

app.get('/', function(req, res){
  res.sendfile(__dirname + '/public/index.html');
});

/*app.get('/data', sendData);
app.get('/display',displayData);*/
app.get('/latest',displayTag);
var latestData = 0;
var oldTag = 0;

var i =10;



SerialPort = serialport.SerialPort, // make a local instance of it
// get port name from the command line:
// portName = process.argv[2];
portName = "COM5";
var myPort = new SerialPort(portName, {
baudRate: 2400,
// look for return and newline at the end of each data packet:
parser: serialport.parsers.readline("\r\n")
});
myPort.on('open', showPortOpen);
myPort.on('data', saveLatestData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

function showPortOpen() {
    console.log('port open. Data rate: ' + myPort.options.baudRate);
}


function saveLatestData(data) {
    if (oldTag != data) {
        latestData = data;
    }
    console.log(data);
    if (oldTag != latestData) {
		//console.log("inside ifs");
		io.on('connection', function (socket) {
			console.log('inside connection 1');
			  socket.emit('news', { hello: latestData });
			  });
		console.log('outside connection 1');
		oldTag = latestData;
	} else {
		//console.log("inside else");
		io.on('connection', function (socket) {
			console.log('inside connection 2');
			  socket.emit('news', { hello: 'No New Tag' });
			  });
	}
}


io.on('connection', function (socket) {
	  
	  var interval = setInterval(function () {
		  if(oldTag != latestData){
			  console.log('inside if in io.connetion');
				var queryString = "SELECT * FROM t_fooddetails where RFID_Tag = '" + latestData+"'";
				
			 	connection.query(queryString, function(err, rows, fields) {
			 		if (err) throw err;
			 		//results = rows;
			 		
			 		//res.render('displaytag.ejs',{title:"Latest Item swiped",data:rows});
			 		socket.emit('news', { hello: latestData , res:rows});
			 		//console.log(rows.length);
			 		//console.log("name"+rows[0].F_Name);
			    });				  
			  
			  oldTag = latestData;
			  
		  }else{
			  console.log('inside else in io.connetion');
			  socket.emit('news', { hello: 'nonewdata'});
		  }
		  
	    }, 1000);
	  socket.on('my other event', function (data) {
	    console.log(data);
	  });
	});	

function showPortClose() {
    console.log('port closed.');
}

function showError(error) {
    console.log('Serial port error: ' + error);
}
/*function sendData(req,res){
	   // console.log(latestData+" "+oldTag);
    if (oldTag != latestData) {   	
		io.on('connection', function (socket) {
			console.log('inside connection 1');
			  io.emit('send tag', { newtag: latestData });
			  });
			
    	oldTag = latestData;
    } else {
    	
    	io.on('connection', function (socket) {
    		console.log('inside connection 2');
			  io.emit('send tag', { newtag: 'No New Tag' });
			  });
    }		
}
function displayData(req,res){
	
	var queryString = 'SELECT * FROM t_fooddetails';
	 	connection.query(queryString, function(err, rows, fields) {
	 		if (err) throw err;
	 		//results = rows;
	 		res.render('displayallitems.ejs',{title:"List of items available ",data:rows});
	    });  		
}
*/
function displayTag(req,res){
	console.log("presenttag"+latestData);
	
	if(latestData){
		
		console.log("hi");
	}else{
		console.log("in else");
	}
	
	if(latestData){
		console.log(typeof(latestData))
		var queryString = "SELECT * FROM t_fooddetails where RFID_Tag = '" + latestData+"'";
		
	 	connection.query(queryString, function(err, rows, fields) {
	 		if (err) throw err;
	 		//results = rows;
	 		console.log("name"+rows[0].F_Name);
	 		res.render('displaytag.ejs',{title:"Latest Item swiped",data:rows});
	    });		
	}else{
	res.send("No Item swiped");
	}
  		
}
/*io.on('connection', function (socket) {
  //socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});*/

/*for(var k=0; k<13; k++){
	if(i>k){
		io.on('connection', function (socket) {
			  io.emit('news', { hello: 'world' });
			  socket.on('my other event', function (data) {
			    console.log(data);
			  });
			});		
	}else{
		io.on('connection', function (socket) {
			  io.emit('news', { hello: 'Bye' });
			  socket.on('my other event', function (data) {
			    console.log(data);
			  });
			});	
		
	}
	
}*/

	

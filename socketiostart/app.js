var express = require('express')
	,app = express()
 	,http = require('http').Server(app)
 	,io = require('socket.io')(http)
 	,path = require('path')
	,routes = require('./routes')
	,serialport = require('serialport') // include the library
	//var servi = require('servi');
	,request = require('request')
	,url = require("url")
	,home=require('./routes/home')
	,mysql = require('./routes/database')
	,serailp = require('./routes/serialport');
var flash = require('express-flash')
var ejs = require("ejs");
var session= require("express-session");
app.set('views', __dirname + '/views');
app.set('public', __dirname + '/public');
app.set('view engine','ejs');
//app.engine('html',require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: '1234567890QWE'}));
app.use(app.router);
var con = mysql.getConnection();
var latestData = 0;
var oldTag = 0;
var userlogged=0;

http.listen(3100, function(){
	  console.log('listening on *:3100');
	});



app.get('/', function(req, res){
		ejs.renderFile('./views/index_sample.ejs',{disname:'Guest'},function(err,result){
		if(!err){
			userlogged=0;
			res.end(result);
		}
		else
			{
			res.end('An error in file  occured');
			console.log(err);
			}
		});
	});

app.get('/swipesample', function(req, res){
	  res.sendfile(__dirname + '/views/index.html');
	});


app.get('/registration', function(req, res){
	ejs.renderFile('./views/registration.ejs',{error:''},function(err,result){	
		if(!err){
			userlogged=0;
			res.end(result);
		}
		else
			{
			res.end('An error in file  occured');
			console.log(err);
			}				
	});
	});

app.get('/display',displayData);
app.get('/latest',displayTag);
app.post('/signup',signUp);
app.get('/afterLogin',afterLogin);
app.get('/savereview',saveReview);
app.get('/logout',logout);



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

io.on('connection', function (socket) {
	  console.log('Connectinf for first tim');
	  latestData = 0;
	  oldTag=0;
	  socket.on('my other event', function (data) {
	    console.log(data);
	  });
});	



function saveLatestData(data) {
	data = data.replace(/^\n(.*)$/g, '$1');
    if (oldTag != data) {
    	
        latestData = data;
        
        var queryString = "SELECT * FROM t_fooddetails where RFID_Tag = '" + latestData+"'";
        
        
	
        con.query(queryString, function(err, rows, fields) {
	 		if (err) throw err;
	 		if(rows[0]){
	 			console.log(rows[0]);
	 			var senddatato = rows[0];
	 			var goodp= rows[0].GoodPoints;
	 			var badp=rows[0].BadPoints;
	 			var goodpointsarray=null;
	 			var badpointsarray=null;
	 			if(goodp){goodpointsarray = goodp.split(',');}
	 			if(badp){badpointsarray = badp.split(',');}
	 			var cal= rows[0].Calories;
	 			console.log(userlogged);
	 			var exceeded=0;
	 			var totalcal=0;
	 			var max_cal;
	 			console.log(rows[0].F_Name);
	 			if(userlogged) {
	 				userlogged= userlogged.trim();
	 				console.log("user logged in "+userlogged );
	 				var qstring = "SELECT dailycount,max_cal FROM t_users where email ='"+userlogged+"'";
	 								
	 				
	 				con.query(qstring, function(err, rows, fields) {
	 				 		if (err){ throw err;}
	 				 		else{
	 				 			
	 				 			
	 				 		totalcal = cal+rows[0].dailycount;
	 				 		max_cal=rows[0].max_cal
	 				 		console.log("total cal so far"+ totalcal);
	 				 			if(totalcal>rows[0].dailycount){
	 				 				console.log("total cal exceeded limit ");
	 				 				exceeded=1;
	 				 			}
	 				 			
	 				 			var qry = "update t_users set dailycount = "+totalcal+" where email='"+userlogged+"'";
	 				 			con.query(qry, function(err, rows, fields) {
	 				 				if (err){ throw err;}
	 				 				else{
	 				 					console.log("updated succesfuly");
	 				 		 			console.log("excede = "+exceeded+"totl"+totalcal);
	 				 		 			console.log(senddatato);
	 				 		 			io.emit('news', { hello: latestData, res:senddatato , goodpoints:goodpointsarray,badpoint:badpointsarray,exceeded:exceeded,totalcalconsumed:totalcal,maxcal:max_cal});
	 				 		 			
	 				 		 			oldTag = latestData;
	 				 				}
	 				 			});
	 				 			
	 				 			
	 				 		}
	 				    });  
	 				
	 			}else{
	 				var senddatato = rows[0];
		 			console.log("excede = "+exceeded+"totl"+totalcal);
		 			io.emit('news', { hello: latestData, res:senddatato , goodpoints:goodpointsarray,badpoint:badpointsarray,exceeded:exceeded,totalcalconsumed:totalcal,maxcal:max_cal});
		 			console.log(rows[0].F_Name);
		 			oldTag = latestData;
	 			}

	 		}	 	    	 	   
	    });		
   
        
    }
    console.log(data);

}
function showPortClose() {
    console.log('port closed.');
}

function showError(error) {
    console.log('Serial port error: ' + error);
}
function displayData(req,res){
	
	var queryString = 'SELECT * FROM t_fooddetails';
	con.query(queryString, function(err, rows, fields) {
	 		if (err) throw err;
	 		//results = rows;
	 		res.render('displayallitems.ejs',{title:"List of items available ",data:rows});
	    });  		
}

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
		
			con.query(queryString, function(err, rows, fields) {
	 		if (err) throw err;
	 		//results = rows;
	 		console.log("name"+rows[0].F_Name);
	 		res.render('displaytag.ejs',{title:"Latest Item swiped",data:rows});
	    });		
	}else{
	res.send("No Item swiped");
	}
  		
}

function signUp(req,res)
{
	
	//req.session.email=req.param("emailid");
	//console.log(req);
	var email=req.param("email");
	email=email.trim();
	var password=req.param("password");
	password=password.trim();
	var maxcal=req.param("maxcal");
	maxcal=maxcal.trim();
	var gender=req.param("gender");
	gender = gender.trim();
	var name = req.param("name");
	name=name.trim();
	console.log(email);
	var getUser="select * from t_users where email='"+email+"'";
	con.query(getUser, function(err,results){
		if(results.length>0){
			
			ejs.renderFile('./views/registration.ejs',{error:'Email id already exists'},function(err,result){	
				if(!err){	
					res.end(result);
				}
				else
					{
					res.end('An error in file  occured');
					console.log(err);
					}				
			});
		}else{
			 var insert="insert into t_users(name,email,max_cal,password,gender)values" +
		 		"('"+name+"','"+email+"',"+maxcal+",'"+password+"','"+gender+"')";
			
			console.log("Query is:"+insert);
			
			var con=mysql.getConnection();
			con.query(insert, function(err,result){
				if(!err){
					req.session.email=email;
					userlogged=email;
					console.log('rendering');
					ejs.renderFile('./views/index_sample.ejs',{disname:name,error:''},function(err,result){	
						if(!err){
//							req.session.email=
							res.end(result);
						}
						else
							{
							res.end('An error in file  occured');
							console.log(err);
							}
					});
			}
				else
					{
					res.end('An error in file occured occured');
					console.log(err);
					}			
				
			});
		}
		
	});

	
	
}
	
function afterLogin(req,res)
{
	
	req.session.email=req.param("emailid");
	var email=req.param("emailid");
    var password=req.param("password");
		
	var getUser="select * from t_users where email='"+email+"' and password='"+password+"'";
	console.log(email);
	console.log("pass="+password);
	
	con.query(getUser, function(err,results){
			
		if(results.length>0)
			{
			
			var str=JSON.stringify(results[0].time);
			req.session.email=email;
			userlogged=email;
			//var jsonparse=JSON.parse(str);
			ejs.renderFile('./views/index_sample.ejs',{disname:results[0].name,email:results[0].email},function(err,result)
					{
				if(!err){
					
					res.end(result);
				}
				else
					{
					res.end('An error in file  occured');
					console.log(err);
					}
				      
					});
			}
		else
			{
			res.end("User Name and Password does not match");
			ejs.renderFile('./views/index_sample.ejs',{},function(err,result){
				if(!err){
					
					res.end(result);
				}
				else
					{
					res.end('An error in file  occured');
					console.log(err);
					}
				      
				
			});
			console.log(err);
			}
		
		
		
		
	});

}

function saveReview(req,res)
{
	
	//res.send('success');
//	req.session.email=req.param("");
	console.log('entered in save review');
	var email=req.param("email");
    var name=req.param("name");
    var subject=req.param("subject");
    var message=req.param("message");
    console.log(email);
    var update="insert into t_reviews(name,email,subject,message)values(' "+name+" ',' "+email+" ','"+subject+"','"+message+"')";
	con.query(update, function(err,results){
		if(!err){
			console.log(results);
			res.send('success');
		}else{
			console.log(err);
			res.send('Error occured, please try again');
		}
		
	});
}



function logout(req,res)
{
	
	
	var emaillogged = req.session.email;
	req.session.destroy(function(err) {
			
		});
	
	
	userlogged=0;
	ejs.renderFile('./views/index_sample.ejs',{disname:'Guest'},function(err,result){
		if(!err){
			
			res.end(result);
		}
		else
			{
			res.end('An error in file  occured');
			console.log(err);
			}
	});
	console.log('user loggd out');
	
}





	

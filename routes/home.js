/**
 * New node file
 */

var ejs = require("ejs");
var mysql = require('./database')
var connection  = mysql.getConnection();

function signup(req,res)
{
	ejs.renderFile('./views/signup.ejs',function(err, result) {
		   // render on success
		   if (!err) {
		            res.end(result);
		   }
		   // render or error
		   else {
		            res.end('An error occurred');
		            console.log(err);
		   }
	   });
	
}
function displayData(req,res){
	
	var queryString = 'SELECT * FROM t_fooddetails';
	 	connection.query(queryString, function(err, rows, fields) {
	 		if (err) throw err;
	 		//results = rows;
	 		res.render('displayallitems.ejs',{title:"List of items available ",data:rows});
	    });  		
}

function displayTag(req,res,latestData){
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
	 		res.render('./views/displaytag.ejs',{title:"Latest Item swiped",data:rows});
	    });		
	}else{
	res.send("No Item swiped");
	}
  		
}

exports.signup=signup;
exports.displayTag=displayTag;
exports.displayData=displayData	;

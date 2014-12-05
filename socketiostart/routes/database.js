/**
 * New node file
 */

var mysql = require('mysql');



var getConnection = function(){
	
	var connection = mysql.createConnection({
	    host: 'localhost',
	    user: 'root',
	    password: 'password',
	    database: 'fooddata',
	});
	
	return connection;
	
}
exports.getConnection=getConnection;

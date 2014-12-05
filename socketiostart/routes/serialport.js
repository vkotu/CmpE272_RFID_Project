/**
 * New node file
 */
var latestData = 0;
var oldTag = 0;

var mysql = require('./database');



function showPortClose() {
    console.log('port closed.');
}

function showError(error) {
    console.log('Serial port error: ' + error);
}
function showPortOpen(myPort) {
    console.log('port open. Data rate: ' + myPort.options.baudRate);
}


function saveLatestData(data) {
	data = data.replace(/^\n(.*)$/g, '$1');
    if (oldTag != data) {
    	
        latestData = data;
        var con = mysql.getConnection();
        var queryString = "SELECT * FROM t_fooddetails where RFID_Tag = '" + latestData+"'";
		
        con.query(queryString, function(err, rows, fields) {
	 		if (err) throw err;
	 		if(rows[0]){
	 			io.emit('news', { hello: latestData, res:rows });
	 			console.log(rows[0].F_Name);
	 			oldTag = latestData;
	 		}	 	    	 	   
	    });		
   
        
    }
    console.log(data);

}



exports.showPortClose = showPortClose;
exports.showPortOpen = showPortOpen;
exports.saveLatestData = saveLatestData;
exports.showError = showError;
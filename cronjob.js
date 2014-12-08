/**
 * New node file
 */
var CronJob = require('cron').CronJob;
var mysql = require('./routes/database');
var con = mysql.getConnection();
var job = new CronJob({
  //cronTime: '* * * * * * ',//seconds,minutes,hours,dayofmonth,months,day of week
  cronTime: '00 00 00 * * *',//runs every beginning of the day 
  //runs the job every day at start od the day.
  onTick: function() {
	  
	  console.log("job started");
		var qry = "update t_users set dailycount = "+0;
			con.query(qry, function(err, rows, fields) {
				if (err){ throw err;}
				else{
					console.log("updated succesfuly");
				}
			});	  
	  
  },
  start: true,
 // timeZone: "America/Los_Angeles"
});



job.start();


/*var job = new CronJob('00 53 10 * * *', function(){
    // Runs every weekday (Monday through Friday)
    // at 11:30:00 AM. It does not run on Saturday
    // or Sunday.
	
	console.log('started');
  }, function () {
    // This function is executed when the job stops
  },
  true  Start the job right now 
  //timeZone  Time zone of this job. 
);*/
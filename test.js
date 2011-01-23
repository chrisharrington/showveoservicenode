//var mongoose = require("mongoose").Mongoose;
//require("./models/uncategorizedMovie").create(mongoose);
//
//var db = mongoose.connect("mongodb://localhost/test");
//db.model("UncategorizedMovie").find().all(function(movies) {
////	for (var i = 0; i < movies.length; i++)
////		movies[i].remove();
//
//	for (var i = 0; i < movies.length; i++)
//		console.log(movies[i].filename + " - " + movies[i].encoded);
//
//	db.close();
//});

//var util = require('util'), spawn = require('child_process').spawn, ls = spawn('ls', ['-lh', '/usr']);

//var ls = require("child_process").spawn('ls', ['-lh', '/usr']);
var ffmpeg = require("child_process").spawn("ffmpeg", ["-i", "test.avi", "-b", "3000k", "-ab", "192k", "test.mp4"]);

ffmpeg.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
});

ffmpeg.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

ffmpeg.on('exit', function (code) {
  console.log('child process exited with code ' + code);
});
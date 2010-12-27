/*sys     = require('sys');
fs      = require('fs');
Inotify = require('inotify').Inotify;

var inotify = new Inotify();

var home_watch_descriptor = inotify.addWatch({
	path: "/home/chrisharrington/Test",
	watch_for: Inotify.IN_CREATE | Inotify.IN_DELETE,
	callback: function(event) {
		var mask = event.mask;
		var name = event.name;
		if (mask & Inotify.IN_CREATE)
			console.log(name + " added.");
		else if (mask & Inotify.IN_DELETE)
			console.log(name + " removed.");
	}
});*/

var mongoose = require("mongoose").Mongoose;
require("./models/user").create(mongoose);
require("./models/movie").create(mongoose);
require("./models/genre").create(mongoose);
require("./models/userMovieInfo").create(mongoose);

var db = mongoose.connect("mongodb://localhost/test");
db.model("UserMovieInfo").find().all(function(infos) {
	for (var i = 0; i < infos.length; i++)
		console.log(infos[i]);
});
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

var db = mongoose.connect("mongodb://localhost/test");
var User = db.model("User");
var user;
User.find({emailAddress: "chrisharrington99@gmail.com"}).first(function(localUser) {
	user = localUser;

	db.model("Movie").find().all(function(movies) {
		for (var i = 0; i l< movies.length; i++)
			console.log(movies[i].name);
	});
});
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

//var db = mongoose.connect("mongodb://localhost/test");
//db.model("User").find({ identity: "757a3f7922bc4176eeae0d8c9611bf1ee7993beb" }).first(function(user) {
//	db.model("UserMovieInfo").find({ "user.identity": user.identity }).all(function(infos) {
//		for (var i = 0; i < infos.length; i++)
//			console.log(infos[i].user.identity);
//
//		db.close();
//	});
//});

console.log(require("guid").create().value);

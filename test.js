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

//var mongoose = require("mongoose").Mongoose;
//require("./models/user").create(mongoose);
//require("./models/movie").create(mongoose);
//require("./models/genre").create(mongoose);
//
//var db = mongoose.connect("mongodb://localhost/test");
//var User = db.model("User");
//User.find({emailAddress: "chrisharrington99@gmail.com"}).all(function(users) {
//	users[0].firstName = "Chris";
//	users[0].save();
//});

require("./extensions/string").initialize();

var router = require("./handlers/router");
router.initialize({ handlers: {}, path: require("path"), root: __dirname });
router.route({
	//url: "/account/signin.data",
	url: "/account/signin/383833ff3fafaf3fafafa3234234.data",
	type: "get"
});

//var path = require("path");
//path.exists(__dirname + "/handlers/account/signin/get.js", function(exists) {
//	console.log(exists);
//});

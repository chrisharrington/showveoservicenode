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

	var movieModel = db.model("Movie");

//	movieModel.find().all(function(movies) {
//		for (var i in movies)
//			console.log(movies[i].name + ": " + movies[i].isFavorite);
//	});

	movieModel.find().first(function(movie) {
		movie.isFavorite = true;

		movie.save(function() {
			console.log("saved");
			db.close();
		});
	});

//	var movie = new movieModel({
//		name: "The Tourist",
//		year: 2010,
//		synopsis: "Revolves around Frank, an American tourist visiting Italy to mend a broken heart. Elise is an extraordinary woman who deliberately crosses his path.",
//		genres: new Array("Action", "Drama", "Thriller"),
//		owner: user,
//		uploadDate: new Date(),
//		lastWatched: null,
//		lastWatchedDate: null,
//		poster: "http://hwcdn.themoviedb.org/posters/f72/4cfeca335e73d6299e004f72/the-tourist-cover.jpg",
//		director: "Florian Henckel von Donnersmarck",
//		actors: new Array("Johnny Depp", "Angelina Jolie"),
//		isFavorite: false,
//		url: "http://www.google.com"
//	});
//
//	movie.save();
});
/*
var mongoose = require("mongoose").Mongoose;
require("./models/uncategorizedMovie").create(mongoose);

var db = mongoose.connect("mongodb://localhost/test");
db.model("UncategorizedMovie").find().all(function(movies) {
	for (var i = 0; i < movies.length; i++)
		console.log(movies[i].filename);

//	for (var i = 0; i < movies.length; i++)
//		movies[i].remove();
//
//	db.model("UserMovieInfo").find().all(function(infos) {
//		for (var i = 0; i < infos.length; i++)
//			infos[i].remove();
//
//		db.close();
//	});
});
*/

/*require("http").createServer(function(request, response) {}).listen(3000, "127.0.0.1");

process.on("exit", function() {
	console.log("Exiting...");
});

process.on('SIGINT', function () {
	console.log("Terminated.");
	process.exit();
});*/

var mapper = require("./remote/movieServiceMapper");

var movieService = require("./remote/movieService");
movieService.initialize(require("http"), "http://www.themoviedb.org/", "c26c67ed161834067f4d91430df1024e");

var database = require("./database").initialize(movieService, mapper);
mapper.initialize(require("./repositories/genreRepository"), database);

require("./repositories/userRepository").getByIdentity("757a3f7922bc4176eeae0d8c9611bf1ee7993beb", {
	success: function(user) {
		console.log(user);
	}
});

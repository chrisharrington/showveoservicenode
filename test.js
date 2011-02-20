/*var mongoose = require("mongoose");
var db = mongoose.connect("mongodb://localhost:3001/dev");

var user = new mongoose.Schema({
        firstName: String,
        lastName: String,
        emailAddress: String,
        identity: String,
        password: String
});
mongoose.model("User", user);

var User = db.model("User");
User.find({}, function(err, users) {
	console.log(users.length);
});*/



var movieService = require("./remote/movieService");
movieService.initialize(require("http"), "http://www.themoviedb.org/", "c26c67ed161834067f4d91430df1024e");

var movieServiceMapper = require("./remote/movieServiceMapper");

require("./database").initialize(movieService, movieServiceMapper);

require("./repositories/genreRepository").getAll({
	success: function(genres) {
		console.log(genres.length);
	}
});

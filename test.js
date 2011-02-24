var repository = require("./repositories/repository").initialize(require("mongodb"), "localhost", 3001, "dev");
var userRepository = require("./repositories/userRepository").create(repository);
var genreRepository = require("./repositories/genreRepository").create(repository);
var userMovieRepository = require("./repositories/userMovieRepository").create(repository);

genreRepository.getAll({
	success: function(genres) {
		var string = require("./service/stringifier").stringify(genres);
		console.log(string);		
	},
	error: function(error) { console.log("error - " + error); }
});
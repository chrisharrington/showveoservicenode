var repository = require("./repositories/repository").initialize(require("mongodb"), "localhost", 3001, "dev");
var userRepository = require("./repositories/userRepository").create(repository);
var genreRepository = require("./repositories/genreRepository").create(repository);
var userMovieRepository = require("./repositories/userMovieRepository").create(repository);
var uncategorizedMovieRepository = require("./repositories/uncategorizedMovieRepository").create(repository);
var movieRepository = require("./repositories/movieRepository").create(repository);

userRepository.getByIdentity("757a3f7922bc4176eeae0d8c9611bf1ee7993beb", {
	error: function() {},
	success: function(user) {

		userMovieRepository.getFavoritesByUser(user, {
			error: function(error) { console.log("error - " + error); },
			success: function(infos) {
				console.log(infos.length);
				infos.forEach(function(info) {
					console.log(info.movie.name);
				});
			}
		});

	}
});
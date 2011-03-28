var repository = require("./repositories/repository").initialize(require("mongodb"), "localhost", 3001, "dev");

var guid = require("guid");
var userRepository = require("./repositories/userRepository").create(repository);
var uncategorizedMovieRepository = require("./repositories/uncategorizedMovieRepository").create(repository);
var genreRepository = require("./repositories/genreRepository").create(repository);
var userMovieRepository = require("./repositories/userMovieRepository").create(repository);
var movieRepository = require("./repositories/movieRepository").create(repository);
var genres = {};

userMovieRepository.removeAll({
	error: function() { console.log("An error has occurred while removing all user-movie info objects."); },
	success: function() {}
});

movieRepository.removeAll({
	error: function() { console.log("An error has occurred while removing all movies."); },
	success: function() {}
});

uncategorizedMovieRepository.removeAll({
	error: function() { console.log("An error has occurred while removing all uncategorized movies."); },
	success: function() {}
});

genreRepository.removeAll({
	error: function(error) { console.log("An error has occurred while removing all genres."); },
	success: function() {
		new Array("Action", "Adventure", "Comedy", "Crime", "Drama", "Fantasy", "Romance", "Science Fiction", "Thriller").forEach(function(name) {
			genreRepository.insert({ id: guid.create().value, name: name }, {
				error: function() { console.log("An error has occurred while inserting the \"" + name + "\" genre."); },
				success: function(genre) { genres[name] = genre; }
			})
		});

	}
});

userRepository.removeAll({
	error: function() { console.log("An error has occurred while removing all users from the user collection."); },
	success: function() {
		userRepository.insert({
			id: guid.create().value,
			firstName: "Chris",
			lastName: "Harrington",
			emailAddress: "chrisharrington99@gmail.com",
			identity: "757a3f7922bc4176eeae0d8c9611bf1ee7993beb",
			password: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
		}, {
			error: function() { console.log("An error has occurred while inserting the base user."); },
			success: function(user) {
				console.log("Complete.");
			}
		});
	}
});
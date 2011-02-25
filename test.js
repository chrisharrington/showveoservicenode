var repository = require("./repositories/repository").initialize(require("mongodb"), "localhost", 3001, "dev");
var userRepository = require("./repositories/userRepository").create(repository);
var genreRepository = require("./repositories/genreRepository").create(repository);
var userMovieRepository = require("./repositories/userMovieRepository").create(repository);
var uncategorizedMovieRepository = require("./repositories/uncategorizedMovieRepository").create(repository);

genreRepository.insert({ name: "Action" }, {
	success: function(genre) { console.log("success - " + genre.name); },
	error: function(error) { console.log("error - " + error); }
});

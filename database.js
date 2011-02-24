//
//	Initializes the database.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Performs the database initialization.
	//	
	exports.initialize = function() {
		var repository = require("./repositories/repository").initialize(require("mongodb"), "localhost", 3001, "dev");
		require("./repositories/userRepository").create(repository);
		require("./repositories/uncategorizedMovieRepository").create(repository);
		require("./repositories/genreRepository").create(repository);
		require("./repositories/userMovieRepository").create(repository);
		require("./repositories/movieRepository").create(repository);

		console.log("Database initialized.");
	};

})();
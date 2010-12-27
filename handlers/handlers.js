//
//	Initializes all of the appropriate handlers.
//
var handlers = function(parameters) {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Creates all of the required request handlers.
	//	parameters:			The parameters object.  Holds all required parameters for handler creation.
	//
	exports.create = function(parameters) {
		createScriptHandlers(parameters);
		createAccountHandlers(parameters);
		createMovieHandlers(parameters);
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Creates all of the required script handlers.
	//	parameters:			The parameters object.  Holds all required parameters for handler creation.
	//
	var createScriptHandlers = function (parameters) {
		require("./script/joined.get").initialize({
			fileJoiner: require("../filejoiner"),
			root: parameters.root
		});
	};

	//
	//	Creates all of the required account handlers.
	//	parameters:			The parameters object.  Holds all required parameters for handler creation.
	//
	var createAccountHandlers = function(parameters) {
		require("./account/signin.get").initialize({
			userRepository: require("../repositories/userRepository"),
			urlParser: require("url")
		});

		require("./account/signin/.get").initialize({
			userRepository: require("../repositories/userRepository"),
			urlParser: require("url")
		});
	};

	//
	//	Creates the movie handlers.
	//	parameters:			The parameters object.  Holds all required parameters for handler creation.
	//
	var createMovieHandlers = function(parameters) {
		var movieRepository = require("../repositories/movieRepository");
		var userRepository = require("../repositories/userRepository");
		require("./movies/recent.get").initialize({
			movieRepository: movieRepository,
			userRepository: userRepository
		});

		require("./movies/favorites.get").initialize({
			movieRepository: movieRepository,
			userRepository: userRepository
		});

		require("./movies/all.get").initialize({
			movieRepository: movieRepository,
			userRepository: userRepository
		});

		require("./movies/genre/.get").initialize({
			movieRepository: movieRepository,
			userRepository: userRepository
		});

		require("./movies/genres.get").initialize({
			genreRepository: require("../repositories/genreRepository")
		});

		require("./movies/favorite/.put").initialize({
			movieRepository: movieRepository	
		});

		require("./movies/unfavorite/.put").initialize({
			movieRepository: movieRepository
		});
	};

}();

//
//	Initializes all of the appropriate handlers.
//
var handlers = function(parameters) {

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
			fileJoiner: require("../file/filejoiner"),
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
		var container = {
			stringifier: require("../service/stringifier"),
			movieRepository: require("../repositories/movieRepository"),
			userRepository: require("../repositories/userRepository"),
			movieInfoRepository: require("../repositories/movieInfoRepository"),
			uncategorizedMovieRepository: require("../repositories/uncategorizedMovieRepository"),
			userMovieRepository: require("../repositories/userMovieRepository"),
			genreRepository: require("../repositories/genreRepository")
		};

		require("./movies/recent.get").initialize(container);
		require("./movies/favorites.get").initialize(container);
		require("./movies/all.get").initialize(container);
		require("./movies/genre/.get").initialize(container);
		require("./movies/genres.get").initialize(container);
		require("./movies/favorite/.put").initialize(container);
		require("./movies/unfavorite/.put").initialize(container);
		require("./movies/uncategorized.get").initialize(container);
		require("./movies/search/.get").initialize(container);
		require("./movies/categorize.put").initialize(container);
	};

}();

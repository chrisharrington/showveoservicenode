//
//	A node.js module used to save an uploaded file.
//
var FileSaver = function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The api key for TheMovieDB.org's api.
	var _key;

	//	The host to connect to for retrieving movie data.
	var _host;

	//	The included file system library.
	var _fs;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the file saver.
	//
	exports.initialize = function() {
		_fs = require("fs");
	};

	//
	//	Saves a movie file.
	//	movie:					The movie information.
	//	file:					The movie file.
	//
	exports.saveMovie = function(movie, file) {
		console.log("save movie!!1");
	}
};

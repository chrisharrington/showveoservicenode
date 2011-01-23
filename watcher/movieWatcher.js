//
//	A watcher used to monitor a folder for adding new movies and removing old movies.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The location in which to store movies.
	var _movieLocation;

	//	The included file system library.
	var _fs;

	//	Encodes movies files.
	var _encoder;

	//	The underlying watcher.
	var _watcher;

	//	A container for uncategorized movie information.
	var _uncategorizedMovieRepository;

	//	Generates unique identifiers.
	var _guidFactory;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the movie watcher.
	//	movieLocation:	The location in which to store movies.
	//	fs:				The included file system library.
	//	encoder:			Encodes movie files.
	//	watcher:			The underlying watcher.
	//	repository:		A container for uncategorized movie information.
	//	guidFactory:		Generates unique identifiers.
	//
	exports.initialize = function(parameters) {
		_movieLocation = parameters.movieLocation;
		_fs = parameters.fs;
		_encoder = parameters.encoder;
		_watcher = parameters.watcher;
		_uncategorizedMovieRepository = parameters.repository;
		_guidFactory = parameters.guidFactory;
	};

	//
	//	Sets the movie watcher to watch the given folder.
	//	folder:			The folder to watch.
	//
	exports.watch = function(folder) {
		_watcher.watch(folder, onMovieAdded, onMovieRemoved);
		console.log("Watching for movies in " + folder + ".");
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Event Handlers */

	//
	//	Fired after a movie has been removed.
	//	filename:			The filename of the removed movie.
	//
	var onMovieRemoved = function(filename) {
		console.log("Movie removed: " + filename);
	};

	//
	//	Fired after a movie has been added.
	//	path:			The path of the added movie file.
	//
	var onMovieAdded = function(path) {
//		if (!path.endsWith(".ogv") && !path.endsWith(".avi") && !path.endsWith(".mkv") && !path.endsWith(".mpg") && !path.endsWith(".mp4"))
//			return;

		var newFilename = _guidFactory.create().value.replace(/-/g, "") + ".raw";
		_fs.rename(path, _movieLocation + newFilename, function() {
			_encoder.encode(_movieLocation + newFilename);
		});
	};

})();

//
//	A container for movie information.
//	db:				The underlying database connection.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The underlying database object.
	var _db;

	//	The error logger.
	var _logger;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Creates the repository.
	//	db:			The underlying database object.
	//	logger:		The error logger.
	//
	exports.create = function(parameters) {
		_db = parameters.db;
		_logger = parameters.logger;
	};

    //
    //	Retrieves a list of the most recently added movies.
    //	count:			The number of movies to add.
	//	handlers:			The function handlers.
    //
	exports.getRecent = function(count, handlers) {
		if (!count)
			count = 5;

		try {
			_db.model("UserMovieInfo").find().sort([[ "movie.name", "ascending" ]]).limit(count).all(function(infos) {
				var movies = new Array();
				for (var i = 0; i < infos.length; i++)
					movies.push(merge(infos[i]));
				if (handlers.success)
					handlers.success(movies);
			});
		} catch (error) {
			_logger.log("movieRepository.getRecent:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

	//
	//	Retrieves a list of the favorite movies.
	//	handlers:			The function handlers.
	//
	exports.getFavorites = function(handlers) {
		try {
			_db.model("UserMovieInfo").find({ isFavorite: true }).sort([[ "movie.name", "ascending" ]]).all(function(infos) {
				var movies = new Array();
				for (var i = 0; i < infos.length; i++)
					movies.push(merge(infos[i]));
				if (handlers.success)
					handlers.success(movies);
			});
		} catch (error) {
			_logger.log("movieRepository.getFavorites:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

	//
	//	Retrieves a list of movies by genre.
	//	handlers:			The function handlers.
	//
	exports.getByGenre = function(genre, handlers) {
		try {
			_db.model("UserMovieInfo").find().sort([[ "movie.name", "ascending" ]]).all(function(infos) {
				var movies = new Array();
				for (var i = 0; i < infos.length; i++) {
					var movie = infos[i].movie;
					for (var j = 0; j < movie.genres.length; j++) {
						if (movie.genres[j].name == genre) {
							movies.push(merge(infos[i]));
							break;
						}
					}
				}
				
				if (handlers.success)
					handlers.success(movies);
			});
		} catch (error) {
			_logger.log("movieRepository.getByGenre:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

	//
	//	Retrieves a list of all movies.
	//	handlers:			The function handlers.
	//
	exports.getAll = function(handlers) {
		try {
			_db.model("UserMovieInfo").find().sort([[ "movie.name", "ascending" ]]).all(function(infos) {
				var movies = new Array();
				for (var i = 0; i < infos.length; i++)
					movies.push(merge(infos[i]));
				if (handlers.success)
					handlers.success(movies);
			});
		} catch (error) {
			_logger.log("movieRepository.getAll:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Merges the user specific movie information and the movie in the given user-movie information object.
	//	info:				The information object.
	//	Returns:			The merged movie object.
	//
	var merge = function (info) {
		var movie = info.movie;
		movie.isFavorite = info.isFavorite;
		return movie;
	};

})();

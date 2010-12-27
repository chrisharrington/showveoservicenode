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
    //	Retrieves a list of the most recently added movies for a user.
	//	user:				The user whose movies are being retrieved.
    //	count:			The number of movies to add.
	//	handlers:			The function handlers.
    //
	exports.getRecent = function(user, count, handlers) {
		if (!count)
			count = 5;

		try {
			_db.model("UserMovieInfo").find({ "user.identity": user.identity }).sort([[ "movie.name", "ascending" ]]).limit(count).all(function(infos) {
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
	//	user:				The user whose movies are being retrieved.
	//	handlers:			The function handlers.
	//
	exports.getFavorites = function(user, handlers) {
		try {
			_db.model("UserMovieInfo").find({ "user.identity": user.identity, isFavorite: true }).sort([[ "movie.name", "ascending" ]]).all(function(infos) {
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
	//	user:				The user whose movies are being retrieved.
	//	genre:			The genre.
	//	handlers:			The function handlers.
	//
	exports.getByGenre = function(user, genre, handlers) {
		try {
			_db.model("UserMovieInfo").find({ "user.identity": user.identity }).sort([[ "movie.name", "ascending" ]]).all(function(infos) {
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
	//	user:				The user whose movies are being retrieved.
	//	handlers:			The function handlers.
	//
	exports.getAll = function(user, handlers) {
		try {
			_db.model("UserMovieInfo").find({ "user.identity": user.identity }).sort([[ "movie.name", "ascending" ]]).all(function(infos) {
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

	//
	//	Sets the favorite status of a movie.
	//	movieID:			The movie ID.
	//	status:			The favorite status.
	//	handlers:			The function handlers.
	//
	exports.setFavorite = function(movieID, status, handlers) {
		try {
			_db.model("UserMovieInfo").find({ "movie.id": movieID }).first(function(info) {
				info.isFavorite = status;
				info.save();

				if (handlers.success)
					handlers.success();
			});
		} catch (error) {
			_logger.log("movieRepository.setFavorite:  " + error);
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

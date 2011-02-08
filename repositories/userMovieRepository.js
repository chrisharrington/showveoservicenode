//
//	A container for user-movie information.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The underlying database object.
	var _db;

	//	The error logger.
	var _logger;

	//	The guid object used to generate new unique IDs.
	var _guid;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Inserts a movie.
	//	movie:			The movie to insert.
	//	handlers:			The function handlers.
	//
	exports.insert = function(movie, handlers) {
		if (!handlers)
			handlers = {};

		try {
			if (!movie)
				throw "The movie given is invalid.";

			movie.id = _guid.create().toString();
			_db.model("User").find().all(function(users) {
				users.forEach(function(user) {
					var model = _db.model("UserMovieInfo");
					var info = new model({
						user: user,
						movie: movie,
						isFavorite: false
					});
					info.save();
				});

				if (handlers.success)
					handlers.success(movie.id);
			});
		} catch (error) {
			_logger.log("movieRepository.insert:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

	//
	//	Updates the given movie.
	//	info:				The user-movie info object to update.
	//	handlers:			The function handlers.
	//
	exports.update = function(info, handlers) {
		if (!handlers)
			handlers = {};

		try {
			if (!info || !info.save)
				throw "The info object given is invalid.";

			_db.model("UserMovieInfo").find({ "movie.id": info.movie.id }).all(function(infos) {
				infos.forEach(function(info) {
					info.movie.encoded = true;
					info.save();
				});
			});
		} catch (error) {
			_logger.log("movieRepository.update:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
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
			_db.model("UserMovieInfo").find({ "user.identity": user.identity }).sort([[ "movie.uploadDate", "descending" ]]).limit(count).all(function(infos) {
				var movies = new Array();
				for (var i = 0; i < infos.length; i++)
					movies.push(merge(infos[i]));
				if (handlers.success)
					handlers.success(movies);
			});
		} catch (error) {
			_logger.log("userMovieRepository.getRecent:  " + error);
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
			_logger.log("userMovieRepository.getFavorites:  " + error);
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
			_logger.log("userMovieRepository.getByGenre:  " + error);
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
			_logger.log("userMovieRepository.getAll:  " + error);
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
			_logger.log("userMovieRepository.setFavorite:  " + error);
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

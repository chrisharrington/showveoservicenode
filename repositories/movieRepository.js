//
//	A container for user-movie information.
//	db:				The underlying database connection.
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
	//	Creates the repository.
	//	db:			The underlying database object.
	//	logger:		The error logger.
	//	guid:		The guid object used to generate new unique IDs.
	//
	exports.create = function(db, logger, guid) {
		_db = db;
		_logger = logger;
		_guid = guid;
	};

	//
	//	Inserts a user-movie information link.
	//	user:				The user.
	//	movie:			The movie to insert.
	//	handlers:			The function handlers.
	//
	exports.insert = function(user, movie, handlers) {
		if (!handlers || !movie || !user)
			return;

		try {
			movie.id = _guid.create().toString();			
			var model = _db.model("UserMovieInfo");
			var info = new model({
				user: user,
				movie: movie,
				isFavorite: false
			});
			info.save(function(error) {
				if (error && handlers.error) {
					handlers.error(error);
					return;
				}

				if (handlers.success)
					handlers.success(info);
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
		if (!info || !handlers)
			return;

		try {
			info.save(function(error) {
				if (handlers.error && error) {
					handlers.error(error);
					return;
				}

				if (handlers.success)
					handlerss.success();
			});
		} catch (error) {
			_logger.log("movieRepository.update:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

	//
	//	Retrieves a movie by ID.
	//	id:				The ID of the movie.
	//	handlers:			The function handlers.
	//
	exports.getByID = function(id, handlers) {
		if (!handlers || !handlers.success)
			return;

		try {
			_db.model("UserMovieInfo").find({ "movie.id": id }, function(infos) {
				if (infos.length > 0)
					handlers.success(infos[0]);
			});
		} catch (error) {
			_logger.log("movieRepository.getByID:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

    //
    //	Retrieves a list of the most recently added movies for a user.
	//	user:				The logged in user.
    //	count:			The number of movies to add.
	//	handlers:			The function handlers.
    //
	exports.getRecent = function(user, count, handlers) {
		if (!count)
			count = 5;
		if (!handlers || !handlers.success)
			return;

		try {
			_db.model("UserMovieInfo").find().limit(count).sort([[ "movie.uploadDate", "descending" ]]).all(function(infos) {
				handlers.success(infos);
			});
		} catch (error) {
			_logger.log("movieRepository.getRecent:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

	//
	//	Retrieves a list of the favorite movies.
	//	user:				The logged in user.
	//	handlers:			The function handlers.
	//
	exports.getFavorites = function(user, handlers) {
		if (!user || !handlers || !handlers.success)
			return;

		try {
			_db.model("UserMovieInfo").find({ "user.identity": user.identity, isFavorite: true }).sort([[ "movie.name", "ascending" ]]).all(function(infos) {
				handlers.success(infos);
			});
		} catch (error) {
			_logger.log("movieRepository.getFavorites:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

	//
	//	Retrieves a list of movies by genre.
	//	user:				The logged in user.
	//	genre:			The genre.
	//	handlers:			The function handlers.
	//
	exports.getByGenre = function(user, genre, handlers) {
		if (!user || !genre || !handlers || !handlers.success)
			return;

		try {
			_db.model("UserMovieInfo").find({ "user.identity": user.identity }).sort([[ "movie.name", "ascending" ]]).all(function(infos) {
				var collection = new Array();
				infos.forEach(function(info) {
					info.movie.genres.forEach(function(localGenre) {
						if (localGenre.name == genre)
							collection.push(info);
					});
				});
				handlers.success(collection);
			});
		} catch (error) {
			_logger.log("movieRepository.getByGenre:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

	//
	//	Retrieves a list of all movies.
	//	user:				The logged in user.
	//	handlers:			The function handlers.
	//
	exports.getAll = function(user, handlers) {
		if (!user || !handlers || !handlers.success)
			return;

		try {
			_db.model("UserMovieInfo").find({ "user.identity": user.identity }).sort([[ "movie.name", "ascending" ]]).all(function(infos) {
				handlers.success(infos);
			});
		} catch (error) {
			_logger.log("movieRepository.getAll:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

	//
	//	Sets the favorite status of a movie.
	//	user:				The logged in user.
	//	movieID:			The movie ID.
	//	status:			The favorite status.
	//	handlers:			The function handlers.
	//
	exports.setFavorite = function(user, movieID, status, handlers) {
		try {
			_db.model("UserMovieInfo").find({ "movie.id": movieID, "user.id": user.id }).first(function(info) {
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

})();

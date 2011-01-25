//
//	A container for uncategorized movie information.
//	db:				The underlying database connection.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The underlying database object.
	var _db;

	//	The logger.
	var _logger;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Creates the repository.
	//	db:			The underlying database object.
	//	logger:		The logger.
	//
	exports.create = function(db, logger) {
		_db = db;
		_logger = logger;
	};

	//
	//	Inserts a new uncategorized movie object.
	//	movie:		The uncategorized movie object to insert.
	//	handlers:		The function handlers.
	//
	exports.insert = function(movie, handlers) {
		try {
			var model = _db.model("UncategorizedMovie");
			var inserted = new model({
				id: movie.id,
				filename: movie.filename,
				createdDate: movie.createdDate,
				encoded: movie.encoded
			});
			inserted.save(function() {
				if (handlers.success)
					handlers.success(inserted);
			});
		} catch (error) {
			_logger.log("uncategorizedMovieRepository.insert:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

	//
	//	Updates an uncategorized movie object.
	//	movie:		The movie to update.
	//	handlers:		The function handlers.
	//
	exports.update = function(movie, handlers) {
		if (!handlers)
			handlers = {};

		try {
			if (!movie.save)
				throw "The given movie is not a valid model.";

			movie.save(function() {
				if (handlers.success)
					handlers.success();
			});
		} catch (error) {
			_logger.log("uncategorizedMovieRepository.update:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

	//
	//	Retrieves an uncategorized movie by ID.
	//	id:			The uncategorized movie ID.
	//	handlers:		The function handlers.
	//
	exports.getByID = function(id, handlers) {
		try {
			if (!id)
				throw "The ID is invalid.";

			_db.model("UncategorizedMovie").find({ id: id }).all(function(movies) {
				if (movies.length == 0)
					handlers.error("No movie with ID \"" + id + "\" was found.");

				handlers.success(movies[0]);
			});

		} catch(error) {
			_logger.log("uncategorizedMovieRepository.getByID:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

	//
	//	Retrieves all uncategorized movies in the repository.
	//	handlers:		The function handlers.
	//
	exports.getAll = function(handlers) {
		try {
			_db.model("UncategorizedMovie").find().all(function(movies) {
				handlers.success(movies);	
			});
		} catch (error) {
			_logger.log("uncategorizedMovieRepository.getAll:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

})();

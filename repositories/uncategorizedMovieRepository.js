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
	exports.create = function(parameters) {
		_db = parameters.db;
		_logger = parameters.logger;
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

})();

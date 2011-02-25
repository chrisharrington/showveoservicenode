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
	//	db:				The underlying database object.
	//	logger:			The logger.
	//
	exports.create = function(db, logger) {
		_db = db;
		_logger = logger;
		return this;
	};

	//
	//	Removes all uncategorized movies from the repository.
	//	handlers:		The function handlers.
	//
	exports.removeAll = function(handlers) {
		_db.removeAll("uncategorizedmovies", handlers);
	};

	//
	//	Inserts a new uncategorized movie object.
	//	movie:			The uncategorized movie object to insert.
	//	handlers:		The function handlers.
	//
	exports.insert = function(movie, handlers) {
		_db.insert("uncategorizedmovies", movie, handlers);
	};

	//
	//	Updates an uncategorized movie object.
	//	movie:			The movie to update.
	//	handlers:		The function handlers.
	//
	exports.update = function(movie, handlers) {
		if (!handlers)
			handlers = { success: function() {}, error: function() {} };
		_db.update("uncategorizedmovies", { id: movie.id }, movie, handlers);
	};

	//
	//	Retrieves an uncategorized movie by ID.
	//	id:				The uncategorized movie ID.
	//	handlers:		The function handlers.
	//
	exports.getByID = function(id, handlers) {
		_db.findOne("uncategorizedmovies", { id: id }, handlers);
	};

	//
	//	Retrieves all uncategorized movies in the repository.
	//	handlers:		The function handlers.
	//
	exports.getAll = function(handlers) {
		_db.find("uncategorizedmovies", handlers);
	};

})();

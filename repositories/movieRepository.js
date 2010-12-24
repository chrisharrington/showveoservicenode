//
//	A container for movie information.
//	db:				The underlying database connection.
//
var template = function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The underlying database object.
	var _db;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Creates the repository.
	//	db:			The underlying database object.
	//
	exports.create = function(db) {
		_db = db;
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
			_db.model("Movie").find().limit(count).all(function(movies) {
				if (handlers.success)
					handlers.success(movies);
			});
		} catch (error) {
			if (handlers.error)
				handlers.error(error);
			else
				throw error;
		}
	};

	//
	//	Retrieves a list of the favorite movies.
	//	handlers:			The function handlers.
	//
	exports.getFavorites = function(handlers) {
		try {
			_db.model("Movie").find({ isFavorite: true }).all(function(movies) {
				if (handlers.success)
					handlers.success(movies);
			});
		} catch (error) {
			if (handlers.error)
				handlers.error(error);
			else
				throw error;
		}
	};

	//
	//	Retrieves a list of movies by genre.
	//	handlers:			The function handlers.
	//
	exports.getAll = function(genre, handlers) {
		try {
			_db.model("Movie").find().in().all(function(movies) {
				if (handlers.success)
					handlers.success(movies);
			});
		} catch (error) {
			if (handlers.error)
				handlers.error(error);
			else
				throw error;
		}
	};

	//
	//	Retrieves a list of all movies.
	//	handlers:			The function handlers.
	//
	exports.getAll = function(handlers) {
		try {
			_db.model("Movie").find().all(function(movies) {
				if (handlers.success)
					handlers.success(movies);
			});
		} catch (error) {
			if (handlers.error)
				handlers.error(error);
			else
				throw error;
		}
	};

}();

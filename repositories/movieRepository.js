//
//	A container for user-movie information.
//	db:				The underlying database connection.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The underlying database object.
	var _db;

	//	The guid object used to generate new unique IDs.
	var _guid;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Creates the repository.
	//	db:			The underlying database object.
	//	guid:		The guid object used to generate new unique IDs.
	//
	exports.create = function(db, guid) {
		_db = db;
		_guid = guid;
		return this;
	};

	//
	//	Removes all movies from the repository.
	//	handlers:		The function handlers.
	//
	exports.removeAll = function(handlers) {
		_db.removeAll("movies", handlers);		
	};

	//
	//	Inserts a movie object..
	//	movie:				The movie to insert.
	//	handlers:			The function handlers.
	//
	exports.insert = function(movie, handlers) {
		_db.insert("movies", movie, handlers);
	};

	//
	//	Updates a movie object.
	//	movie:				The movie to update.
	//	handlers:			The function handlers.
	//
	exports.update = function(movie, handlers) {
		_db.update("movies", movie, handlers);
	};

	//
	//	Retrieves a movie by ID.
	//	id:  				The ID of the movie.
	//	handlers:			The function handlers.
	//
	exports.getByID = function(id, handlers) {
		_db.findOne("movies", { id: id }, handlers);
	};

})();

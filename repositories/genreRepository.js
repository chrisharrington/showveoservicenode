//
//	A container for genre information.
//	db:				The underlying database connection.
//
(function() {

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
		return this;
	};

	//
	//	Removes all genres from the repository.
	//	handlers:		The function handlers.
	//
	exports.removeAll = function(handlers) {
		_db.removeAll("genres", handlers);
	};

	//
	//	Inserts a new genre.
	//	genre:			The genre information to insert.
	//	handlers:		The function handlers.
	//
	exports.insert = function(genre, handlers) {
		_db.insert("genres", genre, handlers);
	};

	//
	//	Updates a genre.
	//	genre:			The genre to update.
	//	handlers:		The function handlers.
	//
	exports.update = function(genre, handlers) {
		_db.update("genres", genre._id, genre, handlers);
	};

	//
	//	Retrieves a list of all genres.
	//	handlers:		The function handlers.
	//
	exports.getAll = function(handlers) {
		_db.find("genres", handlers);
	};

	//
	//	Retrieves a genre by name.
	//	name:		The name of the genre.
	//	handlers:		The function handlers.
	//
	exports.getByName = function(name, handlers) {
		_db.findOne("genres", { name: name }, handlers);
	};

})();
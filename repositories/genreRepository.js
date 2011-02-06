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
	};

	//
	//	Retrieves a list of all genres.
	//	handlers:		The function handlers.
	//
	exports.getAll = function(handlers) {
		try {
			_db.model("Genre").find().all(function(genres) {
				if (handlers.success)
					handlers.success(genres);
			});
		} catch(error) {
			if (handlers.error)
				handlers.error(error);
			else
				throw error;
		}
	};

	//
	//	Retrieves a genre by name.
	//	name:		The name of the genre.
	//	handlers:		The function handlers.
	//
	exports.getByName = function(name, handlers) {
		try {
			_db.model("Genre").find({ "name": name }).all(function(genres) {
				if (genres && genres.length > 0)
					handlers.success(genres[0]);
				else
					handlers.success();
			});
		} catch (error) {
			if (handlers.error)
				handlers.error(error);
			else
				throw error;
		}
	};

	//
	//	Inserts a new genre.
	//	genre:		The genre information to insert.
	//	handlers:		The function handlers.
	//
	exports.insert = function(data, handlers) {
		try {
			var model = _db.model("Genre");
			var genre = new model({
				name: data.name
			});
			genre.save(function() {
				if (handlers.success)
					handlers.success(genre);
			});
		} catch (error) {
			if (handlers.error)
				handlers.error(error);
			else
				throw error;
		}
	};

})();
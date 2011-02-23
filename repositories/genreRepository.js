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
		_db.open(function(error, db) {
			db.collection("genres", function(error, collection) {
				collection.remove(function(error, collection) {
					db.close();
					if (error)
						handlers.error(error);
					else
						handlers.success();
				});
			});
		});
	};

	//
	//	Inserts a new genre.
	//	genre:			The genre information to insert.
	//	handlers:		The function handlers.
	//
	exports.insert = function(genre, handlers) {
		_db.open(function(error, db) {
			db.collection("genres", function(error, collection) {
				collection.insert(genre, function(error, docs) {
					db.close();
					if (error)
						handlers.error(error);
					else
						handlers.success(docs[0]);
				});
			});
		});
	};

	//
	//	Retrieves a list of all genres.
	//	handlers:		The function handlers.
	//
	exports.getAll = function(handlers) {
		try {
			_db.model("Genre").find({}, function(error, genres) {
				if (error && handlers.error) {
					handlers.error(error);
					return;
				}

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
			_db.model("Genre").find({ "name": name }, function(error, genres) {
				if (error && handlers.error) {
					handlers.error(error);
					return;
				}

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

})();
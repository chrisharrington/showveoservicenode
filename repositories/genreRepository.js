//
//	A container for genre information.
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

}();


//
//	A container for user-movie information.
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
	//	db:					The underlying database object.
	//
	exports.create = function(db) {
		_db = db;
		return this;
	};

	//
	//	Removes all user-movie relationships.
	//	handlers:			The function handlers.
	//
	exports.removeAll = function(handlers) {
		_db.open(function(error, db) {
			db.collection("usermovieinfos", function(error, collection) {
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
	//	Inserts a user-movie info object.
	//	info:			The user movie info object to insert.
	//	handlers:		The function handlers.
	//
	exports.insert = function(info, handlers) {
		_db.open(function(error, db) {
			db.collection("usermovieinfos", function(error, collection) {
				collection.insert(info, function(error, docs) {
					db.close();
					if (error)
						handlers.error(error);
					else
						handlers.success(docs[0]);
				});
			});
		});
	};

})();

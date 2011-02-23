//
//	A container for user information.
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
	//	Inserts a new user into the user collection.
	//	user:				The user to insert.
	//	handlers:			The function handlers.
	//
	exports.insert = function(user, handlers) {
		_db.open(function(error, db) {
			db.collection("users", function(error, collection) {
				collection.insert(user, function(error, docs) {
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
	//	Removes all users from the repository.
	//	handlers:			The function handlers.
	//
	exports.removeAll = function(handlers) {
		_db.open(function(error, db) {
			db.collection("users", function(error, collection) {
				collection.remove(function(error, collection) {
					db.close();
					if (error)
						handlers.error();
					else
						handlers.success();
				});
			});
		});
	};

	//
	//	Retrieves a user by email address and password.
	//	email:				The email address of the user.
	//	password:			The password of the user.
	//	handlers:			The function handlers.
	//
	exports.getByEmailAndPassword = function(email, password, handlers) {
		try {
			_db.open(function(error, db) {
				if (error) { handlers.error(error); _db.close(); return; }
				db.collection("users", function(error, collection) {
					if (error) { handlers.error(error); _db.close(); return; }
					collection.find({ emailAddress: email, password: password }, {}, function(error, cursor) {
						if (error) { handlers.error(error); _db.close(); return; }
						cursor.toArray(function(error, users) {
							_db.close();
							if (error)
								handlers.error(error);
							else
								handlers.success(users[0]);
						});
					});
				});
			});
		} catch (error) {
			if (handlers.error)
				handlers.error();
			else
				throw error;
		}
	};

	//
	//	Retrieves a user by identity.
	//	identity:				The user's identity.
	//	handlers:				The handler functions.
	//
	exports.getByIdentity = function(identity, handlers) {
		if (!identity || !handlers)
			return;

		try {
			_db.open(function(error, db) {
				if (error) { handlers.error(error); _db.close(); return; }
				db.collection("users", function(error, collection) {
					if (error) { handlers.error(error); _db.close(); return; }
					collection.find({ identity: identity }, {}, function(error, cursor) {
						if (error) { handlers.error(error); _db.close(); return; }
						cursor.toArray(function(error, users) {
							_db.close();
							if (error)
								handlers.error(error);
							else
								handlers.success(users[0]);
						});
					});
				});
			});
		}
		catch (error) {
			if (handlers.error)
				handlers.error();
			else
				throw error;
		}
	};


})();
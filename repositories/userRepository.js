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
	};

	//
	//	Retrieves a user by email address and password.
	//	email:				The email address of the user.
	//	password:			The password of the user.
	//	Returns:				The retrieved user or null.
	//
	exports.getByEmailAndPassword = function(email, password, handlers) {
		if (!email || !password || !handlers)
			return;

		try {
			_db.model("User").find({emailAddress: email, password: password }).all(function(users) {
				if (users.length == 0 && handlers.success)
					handlers.success();
				else if (handlers.success)
					handlers.success(users[0]);
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
			_db.model("User").find({identity: identity }).all(function(users) {
				if (users.length == 0 && handlers.success)
					handlers.success();
				else if (handlers.success)
					handlers.success(users[0]);
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
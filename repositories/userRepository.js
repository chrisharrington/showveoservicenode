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
		_db.insert("users", user, handlers);
	};

	//
	//	Removes all users from the repository.
	//	handlers:			The function handlers.
	//
	exports.removeAll = function(handlers) {
		_db.removeAll("users", handlers);
	};

	//
	//	Retrieves a user by email address and password.
	//	email:				The email address of the user.
	//	password:			The password of the user.
	//	handlers:			The function handlers.
	//
	exports.getByEmailAndPassword = function(email, password, handlers) {
		_db.findOne("users", { emailAddress: email, password: password }, handlers);
	};

	//
	//	Retrieves a user by identity.
	//	identity:				The user's identity.
	//	handlers:				The handler functions.
	//
	exports.getByIdentity = function(identity, handlers) {
		_db.findOne("users", { identity: identity }, handlers);
	};

})();
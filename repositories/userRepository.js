//
//	A container for user information.
//	db:				The underlying database connection.
//
var userRepository = function() {

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
		if (!email)
			return;
		if (!password)
			return;
		if (!handlers)
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
		}
	};

}();
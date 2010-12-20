//
//	A container for user information.
//	db:				The underlying database connection.
//
exports.create = function(db) {
	if (!db)
		throw "Missing database connection.";

	return {

		//
		//	Retrieves a user by email address and password.
		//	email:				The email address of the user.
		//	password:			The password of the user.
		//	Returns:			The retrieved user or null.
		getByEmailAndPassword: function(email, password, handlers) {
			if (!email)
				return;
			if (!password)
				return;
			if (!handlers)
				return;

			db.model("User").find({emailAddress: email, password: password }).all(function(users) {
				if (users.length == 0 && handlers.success)
					handlers.success();
				else if (handlers.success)
					handlers.success(users[0]);
			});

//			User.find({}).all(function(users) {
//				console.log(users.length);
//			//	for (var i = 0; i < users.length; i++)
//			//		users[i].remove();
//			});;
		}
	};
};

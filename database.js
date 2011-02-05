//
//	Initializes the database.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Performs the database initialization.
	//	movieService:				The remote movie service.
	//	
	exports.initialize = function(movieService) {
		var mongoose = require("mongoose").Mongoose;
		require("./models/user").create(mongoose);
		require("./models/movie").create(mongoose);
		require("./models/genre").create(mongoose);
		require("./models/userMovieInfo").create(mongoose);
		require("./models/uncategorizedMovie").create(mongoose);

		var db = mongoose.connect("mongodb://localhost:3002/dev");

		var usermodel = db.model("User");
		usermodel.find({}).all(function(users) {
			if (users.length > 0)
				return;

			new usermodel({
				firstName: "Chris",
				lastName: "Harrington",
				emailAddress: "chrisharrington99@gmail.com",
				password: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
				identity: "757a3f7922bc4176eeae0d8c9611bf1ee7993beb"
			}).save();
		});

		var logger = require("./logging/logger");
		require("./repositories/userRepository").create(db);
		require("./repositories/movieRepository").create(db, logger);
		require("./repositories/genreRepository").create(db);
		require("./repositories/uncategorizedMovieRepository").create(db, logger);
		require("./repositories/movieInfoRepository").create(db, logger, movieService);

		console.log("Database initialized.");

		return db;
	};

})();
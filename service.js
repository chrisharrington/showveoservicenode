//
//	The main application for the service.
//
var service = {
	initialize: function(parameters) {

		//------------------------------------------------------------------------------------------------------------------
		/* Data Members */

		//	The included file system library.
		var _fs;

		//	The included multipart form parser library.
		var _formidable;

		//	The root uploads directory.
		var _uploads;

		//------------------------------------------------------------------------------------------------------------------
		/* Private Methods */

		//
		//	Initializes the mongoose database connection.
		//
		var initializeDatabase = function() {
			var mongoose = require("mongoose").Mongoose;
			require("./models/user").create(mongoose);
			require("./models/movie").create(mongoose);
			require("./models/genre").create(mongoose);

			var db = mongoose.connect("mongodb://localhost/test");

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

			require("./repositories/userRepository").create(db);

			console.log("Database initialized.");
		};

		//
		//	Initializes the creation of all required request handlers.
		//
		var initializeHandlers = function () {
			require("./handlers/handlers").create({
				root: parameters.root
			});
		};

		//
		//	Initializes the web server.
		//	port:				The port on which the web server should listen for requests.
		//
		var initializeWebServer = function(port) {
			var webserver = require("./webserver");
			webserver.initialize({
				router: require("./handlers/router"),
				http: require("http"),
				root: parameters.root,
				fileretriever: require("./fileretriever")
			});
			webserver.run(port);
		};

		//------------------------------------------------------------------------------------------------------------------

		require("./extensions/string").initialize();
		require("./handlers/router").initialize({
			path: require("path"),
			root: __dirname
		});

		initializeDatabase();
		initializeHandlers();
		initializeWebServer(parameters.port);
	}
}.initialize({
	port: 3000,
	root: "/home/chrisharrington/Code/showveo",
	uploads: "/home/chrisharrington/Code/showveoservice/uploads"
});

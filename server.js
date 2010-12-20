//
//	The main server.  Delegates to handlers based on incoming requests.
//
var Server = {
	initialize: function(parameters) {

		//------------------------------------------------------------------------------------------------------------------
		/* Data Members */

		//	The included file system library.
		var _fs;

		//	The included multipart form parser library.
		var _formidable;

		//	The root path for all applications.
		var _root;

		//	The root uploads directory.
		var _uploads;

		//------------------------------------------------------------------------------------------------------------------
		/* Private Methods */

		//
		//	Initializes the mongoose database connection.
		//	Returns:				The repositories container.
		//
		var createDatabase = function() {
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

			var repositories = {};
			repositories.user = require("./repositories/userRepository").create(db);

			console.log("Database initialized.");

			return repositories;
		};

		//
		//	Initializes the static server.
		//	port:				The port on which the static server should listen for requests.
		//
		var initializeStaticServer = function(port) {
			var staticserver = require("./staticserver");
			staticserver.initialize({
				http: require("http"),
				fileretriever: require("./fileretriever"),
				root: parameters.root
			});
			staticserver.run(port);
		};

		//
		//	Initializes the web server.
		//	port:				The port on which the web server should listen for requests.
		//	repositories:		The repositories container.
		//
		var initializeWebServer = function(port, repositories) {
			var webserver = require("./webserver");
			webserver.initialize({
				http: require("http"),
				fs: require("fs"),
				url: require("url"),
				formidable: require("formidable"),
				root: parameters.root,
				uploads: parameters.uploads,
				filejoiner: require("./filejoiner"),
				filessaver: require("./filesaver"),
				fileretriever: require("./fileretriever"),
				movieservice: require("./movieservice"),
				repositories: repositories
			});
			webserver.run(port);
		};

		//------------------------------------------------------------------------------------------------------------------

		require("./extensions/string").initialize();

		var repositories = createDatabase();
		initializeWebServer(parameters.port, repositories);
	}
}.initialize({
	port: 3000,
	root: "/home/chrisharrington/Code/showveo",
	uploads: "/home/chrisharrington/Code/showveoservice/uploads"
});

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
		//	Loads the exit events.
		//	database:			The database object that needs to be closed on exit.
		//
		var loadExitEvents = function(database) {
			process.on("SIGINT", function() {
				process.exit();	
			});

			process.on("exit", function() {
				console.log("Process disposed.");
			});
		};

		//------------------------------------------------------------------------------------------------------------------

		require("./extensions/string").initialize();

		var movieService = require("./remote/movieService");
		movieService.initialize(require("http"), "http://www.themoviedb.org/", "c26c67ed161834067f4d91430df1024e");

		var movieServiceMapper = require("./remote/movieServiceMapper");

		var models = require("./database").initialize(movieService, movieServiceMapper);
		require("./handlers/handlers").create({
			root: parameters.root
		});

		//movieServiceMapper.initialize(require("./repositories/genreRepository"), models["Movie"]);

		require("./handlers/router").initialize({
			path: require("path"),
			root: __dirname,
			userRepository: require("./repositories/userRepository")
		});

		var watcher = require("./watcher/watcher");
		watcher.initialize();

		var encoder = require("./encoding/encoder");
		encoder.initialize(require("child_process"));

		var movieEncoder = require("./encoding/movieEncoder");
		movieEncoder.initialize(encoder, require("fs"), require("./repositories/uncategorizedMovieRepository"), require("./repositories/movieRepository"), require("guid"));

		var movieWatcher = require("./watcher/movieWatcher");
		movieWatcher.initialize({
			watcher: watcher,
			repository: require("./repositories/uncategorizedMovieRepository"),
			guidFactory: require("guid"),
			movieLocation: "/home/chris/Videos/showveo/",
			fs: require("fs"),
			encoder: movieEncoder
		});
		movieWatcher.watch("/home/chris/Test");

		var webserver = require("./webserver");
		webserver.initialize({
			router: require("./handlers/router"),
			http: require("http"),
			root: parameters.root,
			fileretriever: require("./file/fileretriever"),
			querystring: require("querystring")
		});
		webserver.run(parameters.port);
	}
}.initialize({
	port: 3000,
	root: __dirname.replace(/showveoservice/g, "") + "showveo",
	uploads: "~/Code/showveoservice/uploads"
});

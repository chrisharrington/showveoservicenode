//
//	The main application for the service.
//
var service = {
	initialize: function(parameters) {

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

		//
		//	Loads any extension methods.
		//
		var loadExtensions = function () {
			require("./extensions/string").initialize();
		};

		//
		//	Loads the movie service components.
		//
		var loadMovieService = function() {
			var movieService = require("./remote/movieService");
			movieService.initialize(require("http"), "http://www.themoviedb.org/", "c26c67ed161834067f4d91430df1024e");

			var movieServiceMapper = require("./remote/movieServiceMapper");
			movieServiceMapper.initialize(require("./repositories/genreRepository"));

			require("./repositories/movieInfoRepository").create(require("./logging/logger"), movieService, movieServiceMapper);
		};

		//
		//	Loads the database components.
		//
		var loadDatabase = function() {
			require("./database").initialize();
		};

		//
		//	Loads the request handlers.
		//	root:				The root location of the request handlers.
		//
		var loadHandlers = function(root) {
			require("./handlers/handlers").create({
				root: root
			});

			require("./handlers/router").initialize({
				path: require("path"),
				root: __dirname,
				userRepository: require("./repositories/userRepository")
			});
		};

		//
		//	Loads the encoder components.
		//
		var loadEncoders = function() {
			var encoder = require("./encoding/encoder");
			encoder.initialize(require("child_process"), "mp4");

			var movieEncoder = require("./encoding/movieEncoder");
			movieEncoder.initialize(encoder, require("fs"), require("./repositories/uncategorizedMovieRepository"), require("./repositories/movieRepository"), require("guid"));
		};

		//
		//	Loads the directory monitor components.
		//	movieSourceDirectory:			The directory to watch for new movie additions.
		//	movieDestinationDirectory:		The directory in which new movies are stored.
		//
		var loadWatchers = function(movieSourceDirectory, movieDestinationDirectory) {
			var watcher = require("./watcher/watcher");
			watcher.initialize();

			var movieWatcher = require("./watcher/movieWatcher");
			movieWatcher.initialize({
				watcher: watcher,
				guidFactory: require("guid"),
				movieLocation: movieDestinationDirectory,
				fs: require("fs"),
				encoder: require("./encoding/movieEncoder")
			});
			movieWatcher.watch(movieSourceDirectory);
		};

		//
		//	Loads the webserver.
		//	root:							The root directory for retrieving static files.
		//	movieRoot:						The movie root location.
		//	port:							The port on which the webserver should listen.
		//
		var loadWebserver = function(root, movieRoot, port) {
			var webserver = require("./webserver");
			webserver.initialize({
				router: require("./handlers/router"),
				http: require("http"),
				root: root,
				movieRoot: movieRoot,
				fileretriever: require("./file/fileretriever"),
				querystring: require("querystring"),
				useragentanalyzer: require("./service/useragentanalyzer")
			});
			webserver.run(port);
		};

		//------------------------------------------------------------------------------------------------------------------

		loadExtensions();
		loadDatabase();
		loadMovieService();
		loadHandlers(parameters.root);
		loadEncoders();
		loadWatchers(parameters.movieWatch, parameters.movieRoot);
		loadWebserver(parameters.root, parameters.movieRoot, parameters.port);
	}
}.initialize({
	port: 3000,
	root: "/home/chris/Code/showveo",
	movieRoot: "/home/chris/Videos/showveo",
	movieWatch: "/home/chris/Videos/showveo/temp"
});

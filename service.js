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

		require("./extensions/string").initialize();
		require("./handlers/router").initialize({
			path: require("path"),
			root: __dirname
		});

		require("./database").initialize();
		require("./handlers/handlers").create({
			root: parameters.root
		});

		var watcher = require("./watcher/watcher");
		watcher.initialize();

		var encoder = require("./encoding/encoder");
		encoder.initialize(require("child_process"));

		var movieEncoder = require("./encoding/movieEncoder");
		movieEncoder.initialize(encoder, require("fs"), require("./repositories/uncategorizedMovieRepository"), require("guid"));

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
			fileretriever: require("./file/fileretriever")
		});
		webserver.run(parameters.port);
	}
}.initialize({
	port: 3000,
	root: __dirname.replace(/showveoservice/g, "") + "showveo",
	uploads: "~/Code/showveoservice/uploads"
});

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

		var staticserver = require("./staticserver");
		staticserver.initialize({
			http: parameters.http,
			fileretriever: parameters.fileretriever,
			root: parameters.root
		});
		staticserver.run(3000);

		var dynamicserver = require("./dynamicserver");
		dynamicserver.initialize({
			http: parameters.http,
			fs: parameters.fs,
			formidable: parameters.formidable,
			root: parameters.root,
			uploads: parameters.uploads,
			filejoiner: parameters.filejoiner,
			filessaver: parameters.filesaver,
			movieservice: parameters.movieservice
		});
		dynamicserver.run(3001);
	}
}.initialize({
	http: require("http"),
	formidable: require("formidable"),
	port: 3000,
	root: "/home/chrisharrington/Code/showveo",
	uploads: "/home/chrisharrington/Code/showveoservice/uploads",
	filejoiner: require("./filejoiner"),
	fileretriever: require("./fileretriever"),
	movieservice: require("./movieservice"),
	filesaver: {}
});


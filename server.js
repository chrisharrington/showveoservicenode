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

//		_fs = parameters.fs;
//		_formidable = parameters.formidable;
//		_root = parameters.root;
//		_uploads = parameters.uploads;
//
//		parameters.movieservice.initialize("c26c67ed161834067f4d91430df1024e");
//
//		parameters.http.createServer(function(request, response) {
//			if (request.url.indexOf("favicon.ico") > -1)
//				return;
//
//			switch (deriveDirector(request.url)) {
//				case "joiner": handleJoiner(parameters.filejoiner, request.url, response); break;
//				case "upload": handleUpload(parameters.filesaver, request, response); break;
//				case "movie": handleMovie(parameters.movieservice, request, response); break;
//				default: handleStaticFile(parameters.fileretriever, request.url, response); break;
//			}
//		}).listen(parameters.port, "127.0.0.1");
//
//		console.log("Server listening on " + parameters.port + ".");

		

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


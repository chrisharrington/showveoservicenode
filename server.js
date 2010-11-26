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

		_fs = parameters.fs;
		_formidable = parameters.formidable;
		_root = parameters.root;
		_uploads = parameters.uploads;

		parameters.movieservice.initialize("c26c67ed161834067f4d91430df1024e");

		parameters.http.createServer(function(request, response) {
			if (request.url.indexOf("favicon.ico") > -1)
				return;

			switch (deriveDirector(request.url)) {
				case "joiner": handleJoiner(parameters.filejoiner, request.url, response); break;
				case "upload": handleUpload(parameters.filesaver, request, response); break;
				case "movie": handleMovie(parameters.movieservice, request, response); break;
				default: handleStaticFile(parameters.fileretriever, request.url, response); break;
			}
		}).listen(parameters.port, "127.0.0.1");

		console.log("Server listening on " + parameters.port + ".");

		//------------------------------------------------------------------------------------------------------------------
		/* Private Methods */

		//
		//	Parses the url to derive the director.
		//	url:					The url to parse.
		//	Returns:				The director.
		//
		var deriveDirector = function(url) {
			var parts = url.split("/");
			if (parts.length == 0)
				return;

			if (parts[0] == "" && parts.length > 1)
				return parts[1];
		};

		//
		//	Handles a request to the joiner application.
		//	filejoiner:				The file joiner application to invoke.
		//	url:					The url of the request.
		//	response:				The response object.
		//
		var handleJoiner = function(filejoiner, url, response) {
			var parts = url.replace("/joiner/", "").split("/");
			if (parts.length == 0)
				throw { code: 500, message: "Unable to parse url." }

			filejoiner.join({ 
				root: _root,
				path: parts.slice(1, parts.length).join("/"),
				extension: parts[0],
				callback: function(data) {
					response.writeHead(200, { "Content-Type": "text/plain" });
					for (var i = 0; i < data.length; i++)
						response.write(data[i]);
					response.end();
				}
			});
		};

		//
		//	Handles a request for a static file.
		//	fileretriever:			The file retriever application to invoke.
		//	url:					The url of the request.
		//	response:				The response object.
		//
		var handleStaticFile = function(fileretriever, url, response) {
			var path = _root + url;
			fileretriever.getFile(path, function(file, type) {
				response.writeHead(200, { "Content-Type": type });
				response.end(file, "binary");
			}, function(error) {
				response.writeHead(404, { "Content-Type": "text/plain" });
				response.end(error);
			});
		};

		//
		//	Handles a request for movie information.
		//	movieservice:			The movie service application to invoke.
		//	request:				The request object.
		//	response:				The response object.
		//
		var handleMovie = function(movieservice, request, response) {
			var url = request.url.replace("/movie/", "");
			var parts = url.split("/");
			if (parts.length < 1)
				throw { code: 500, message: "No function specified for the movie service." };

			switch (parts[0]) {
				case "search": handleMovieSearch(movieservice, request, response); break;
				case "info": handleMovieInfo(movieservice, request, response); break;
				default: throw { code: 500, message: "No function specified for the movie service." };
			}
		};

		//
		//	Handles a movie search request.
		//	movieservice:			The movie service application to invoke.
		//	request:				The request object.
		//	response:				The response object.
		//
		var handleMovieSearch = function(movieservice, request, response) {
			movieservice.search(request.url.replace("/movie/search/", ""), function(movies) {
				response.writeHead(200, { "Content-Type": "application/json" });
				response.end(movies);
			});
		};

		//
		//	Handles a request for detailed movie information.
		//	movieservice:			The movie service application to invoke.
		//	request:				The request object.
		//	response:				The response object.
		//
		var handleMovieInfo = function(movieservice, request, response) {
			movieservice.info(request.url.replace("/movie/info/", ""), function(info) {
				response.writeHead(200, { "Content-Type": "application/json" });
				response.end(info);
			});
		};

		//
		//	Handles a request used to upload a file.
		//	filesaver:				The file saver application to invoke.
		//	request:				The request object.
		//	response:				The response object.
		//
		var handleUpload = function(filesaver, request, response) {
			var parts = request.url.split("/");

			if (parts[1] != "upload")
				throw { code: 500, message: "Request was routed incorrectly - " + request.url };
			if (parts.length < 3)
				throw { code: 500, message: "Upload request has missing command - " + request.url };

			switch (parts[2]) {
				case "movie": handleUploadMovie(filesaver, request, response); break;
				default: throw { code: 500, message: "Upload request had invalid command - " + request.url };
			}
		};

		//
		//	Handles the upload of a movie.
		//	filesaver:				The file saver application to invoke.
		//	request:				The request object.
		//	response:				The response object.
		//
		var handleUploadMovie = function(filesaver, request, response) {
			var parts = request.url.split("/");
			if (parts.length < 4)
				throw { code: 500, message: "Movie upload request is missing movie ID - " + request.url };

			var movieID = parseInt(parts[3]);
			if (isNaN(movieID))
				throw { code: 500, message: "Movie upload request has malformed movie ID - " + request.url };

			var form = new _formidable.IncomingForm();
			form.uploadDir = _uploads + "/movies";
			form.parse(request, function(err, fields, file) {
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.end();
				console.log(file.Filedata);
			});
		};

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


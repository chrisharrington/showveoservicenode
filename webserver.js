//
//	A node.js module encapsulating a dynamic content web server.
//
var DynamicServer = function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	Routes incoming requests to the appropriate handler.
	var _router;

	//	The included http library.
	var _http;

	//	The included file system library.
	var _fs;

	//	The included url parsing library.
	var _url;

	//	The included multipart form parser library.
	var _formidable;

	//	The root path for all applications.
	var _root;

	//	The root uploads directory.
	var _uploads;

	//	The file joining library.
	var _filejoiner;

	//	The file saving library.
	var _filesaver;

	//	Retrieves files to be written.
	var _fileretriever;

	//	The movie service used to retrieve movie details.
	var _movieservice;

	//	The repositories container.
	var _repositories;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the dynamic server components.
	//	router:			Routes incoming requests to the appropriate handler.
	//	http:				The included http library.
	//	fs:				The included file system library.
	//	url:				The included url parsing library.
	//	formidable:		The included multipart form parser library.
	//	root:				The root path for all applications.
	//	uploads:			The root uploads directory.
	//	filejoiner:			The file joining library.
	//	filesaver:			The file saving library.
	//	fileretriever:		The file retrieval library.
	//	movieservice:		The movie service used to retrieve movie details.
	//	repositories:		The repositories container.
	//
	exports.initialize = function(parameters) {
		_router = parameters.router;
		_http = parameters.http;
		_fs = parameters.fs;
		_url = parameters.url;
		_formidable = parameters.formidable;
		_root = parameters.root;
		_uploads = parameters.uploads;
		_filejoiner = parameters.filejoiner;
		_filesaver = parameters.filesaver;
		_fileretriever = parameters.fileretriever;
		_movieservice = parameters.movieservice;
		_repositories = parameters.repositories;
	};

	//
	//	Runs the server.
	//	port:				The port on which to run the server.
	//
	exports.run = function(port) {
		_http.createServer(function(request, response) {
			var url = request.url;
			if (url.indexOf("?") > -1)
				url = url.substring(0, url.indexOf("?"));

			if (url.endsWith(".data"))
				_router.route(request, response);
			else
				handleStaticRequest(request, response);
		}).listen(port, "127.0.0.1");

		console.log("Web server listening on " + port + ".");
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Handles a dynamic request.
	//	request:				The request object.
	//	response:				The response object.
	//
	var handleDynamicRequest = function(request, response) {
		request.url = request.url.replace(/.data/g, "");
		switch (deriveUrlPart(request.url, 0)) {
			case "joiner": handleJoiner(_filejoiner, request.url, response); break;
			case "upload": handleUpload(_filesaver, request, response); break;
			case "movie": handleMovie(_movieservice, request, response); break;
			case "account": handleAccount(request, response, _repositories.user); break;
			default: throw "No handler available for request \"" + request.url + "\"."; break;
		}
	};

	//
	//	Handles a static request.
	//	request:				The request object.
	//	response:				The response object.
	//
	var handleStaticRequest = function(request, response) {
		if (request.headers.range)
			handleStreamedFile(_fileretriever, request, response);
		else
			handleStaticFile(_fileretriever, request.url, response);
	};

	//
	//	Handles a request for a streamed file.
	//	fileretriever:			The file retriever application to invoke.
	//	request:				The request object.
	//	response:				The response object.
	//
	var handleStreamedFile = function (fileretriever, request, response) {
		var path = _root + request.url;
		fileretriever.getFile(path, function(file, type) {
			var range = request.headers.range;
			var total = file.length;

			var parts = range.replace(/bytes=/, "").split("-");
			var partialstart = parts[0];
			var partialend = parts[1];

			var start = parseInt(partialstart, 10);
			var end = partialend ? parseInt(partialend, 10) : total-1;

			var chunksize = (end-start)+1;

			response.writeHead(206, { "Connection": "Close", "Content-Range": "bytes " + start + "-" + end + "/" + total, "Accept-Ranges": "bytes", "Content-Length": chunksize, "Content-Type": type });
			response.end(file.slice(start, end), "binary");
		}, function(error) {
			response.writeHead(404, { "Content-Type": "text/plain" });
			response.end(error);
		});
	};

	//
	//	Handles a request for a static file.
	//	fileretriever:			The file retriever application to invoke.
	//	url:					The url of the request.
	//	response:				The response object.
	//
	var handleStaticFile = function(fileretriever, url, response) {
		if (url == "/")
			url = "/index.html";

		var index = url.indexOf("?");
		if (index > -1)
			url = url.substring(0, index);

		var path = _root + url;
		fileretriever.getFile(path, function(file, type) {
			response.writeHead(200, { "Content-Type": type, "Content-Length": file.length });
			response.end(file, "binary");
		}, function(error) {
			response.writeHead(404, { "Content-Type": "text/plain" });
			response.end(error);
		});
	};

	//
	//	Derives a part of the request url as specified by the given index.
	//	url:					The url to parse.
	//	index:					The url part index.
	//	Returns:				The parsed url part.
	//
	var deriveUrlPart = function(url, index) {
		if (url.indexOf("?") > -1)
			url = url.substring(0, url.indexOf("?"));
		return url.split("/")[index+1];
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
				response.end(data);
			}
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

	//
	//	Handles an account request.
	//	request:				The request object.
	//	response:				The response object.
	//
	var handleAccount = function(request, response, userRepository) {
		switch (deriveUrlPart(request.url, 1)) {
			case "signin":
				var parsed = _url.parse(request.url, true);
				userRepository.getByEmailAndPassword(parsed.query.emailAddress, parsed.query.password, {
					success: function(user) {
						response.writeHead(200, { "Content-Type": "application/json" });
						response.end(JSON.stringify(user));
					},
					error: function() {
						response.writeHead(500, { "Content-Type": "text/plain" });
						response.end("An error has occurred while retrieving the logged in user.");
					}
				});
		}
	};

}();
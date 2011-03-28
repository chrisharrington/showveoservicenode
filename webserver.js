//
//	A node.js module encapsulating a dynamic content web server.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	Routes incoming requests to the appropriate handler.
	var _router;

	//	The included http library.
	var _http;

	//	The root path for all applications.
	var _root;

	//	The movie root location.
	var _movieRoot;

	//	Retrieves files to be written.
	var _fileretriever;

	//	The included query string library.
	var _querystring;

	//	The user-agent analyzer used to determine if a request comes from a mobile or desktop browser.
	var _useragentanalyzer;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the dynamic server components.
	//	router:			Routes incoming requests to the appropriate handler.
	//	http:				The included http library.
	//	root:				The root path for all applications.
	//	movieRoot:			The movie root location.
	//	fileretriever:		The file retrieval library.
	//	querystring:		The included query string library.
	//	useragentanalyzer:	The user-agent analyzer.
	//
	exports.initialize = function(parameters) {
		_router = parameters.router;
		_http = parameters.http;
		_root = parameters.root;
		_movieRoot = parameters.movieRoot;
		_fileretriever = parameters.fileretriever;
		_querystring = parameters.querystring;
		_useragentanalyzer = parameters.useragentanalyzer;
	};

	//
	//	Runs the server.
	//	port:				The port on which to run the server.
	//
	exports.run = function(port) {
		_http.createServer(function(request, response) {

			var data = "";
			request.on("data", function(chunk) {
				data += chunk;
			});
			request.on("end", function() {
				request.data = _querystring.parse(data);
				
				var url = request.url;
				if (url.indexOf("?") > -1)
					url = url.substring(0, url.indexOf("?"));

				if (url.endsWith(".data"))
					_router.route(request, response);
				else {
					request.root = _root;
					handleStaticRequest(request, response);
				}
			});
		}).listen(port);

		console.log("Web server listening on " + port + ".");
		console.log("Web server root location set to " + _root + ".");
		console.log("Web server movie root location set to " + _movieRoot + ".");
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Handles a static request.
	//	request:				The request object.
	//	response:				The response object.
	//
	var handleStaticRequest = function(request, response) {
		if (request.url.endsWith(".movie"))
			handleMovieRequest(request, response);
		else if (request.headers.range)
			handleStreamedFile(request, response);
		else
			handleStaticFile(request, response);
	};

	//
	//	Handles a movie request.
	//	request:				The request object.
	//	response:				The response object.
	//
	var handleMovieRequest = function (request, response) {
		request.root = _movieRoot;
		request.url = request.url.replace(".movie", (_useragentanalyzer.isDesktop(request.headers["user-agent"]) ? ".full" : ".mobile"));
		handleStaticRequest(request, response);
	};

	//
	//	Handles a request for a streamed file.
	//	request:				The request object.
	//	response:				The response object.
	//
	var handleStreamedFile = function (request, response) {
		getFile(request, function(file, type) {
			var range = request.headers.range;
			var total = file.length;

			var parts = range.replace(/bytes=/, "").split("-");
			var partialstart = parts[0];
			var partialend = parts[1];

			var start = parseInt(partialstart, 10);
			var end = partialend ? parseInt(partialend, 10) : total-1;

			var chunk = file.slice(start, end+1);
			var chunksize = chunk.length;

			response.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, "Accept-Ranges": "bytes", "Content-Length": chunksize, "Content-Type": type });
			response.end(chunk, "binary");
		}, function(error) {
			response.writeHead(404, { "Content-Type": "text/plain" });
			response.end(error);
		});
	};

	//
	//	Handles a request for a static file.
	//	request:				The request object.
	//	response:				The response object.
	//
	var handleStaticFile = function(request, response) {
		var url = request.url;
		if (url == "/")
			url = "/index.html";

		var index = url.indexOf("?");
		if (index > -1)
			url = url.substring(0, index);

		request.url = url;
		getFile(request, function(file, type) {
			response.writeHead(200, { "Content-Type": type, "Content-Length": file.length });
			response.end(file, "binary");
		}, function(error) {
			response.writeHead(404, { "Content-Type": "text/plain" });
			response.end(error);
		});
	};

	//
	//	Gets a file by first checking the raw path and, if it's not found, then checks for the existence of mobile or
	//	desktop versions of the file.
	//	request:				The request object.
	//	success:				The callback function to execute on successful file retrieval.
	//	fail:					The error callback.
	//
	var getFile = function(request, success, fail) {
		var path = request.root + request.url;
		
		_fileretriever.getFile(path, function(file, type) {
			success(file, type);
		}, function() {
			fail();
		});
	};

})();
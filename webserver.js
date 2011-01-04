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

	//	Retrieves files to be written.
	var _fileretriever;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the dynamic server components.
	//	router:			Routes incoming requests to the appropriate handler.
	//	http:				The included http library.
	//	root:				The root path for all applications.
	//	fileretriever:		The file retrieval library.
	//
	exports.initialize = function(parameters) {
		_router = parameters.router;
		_http = parameters.http;
		_root = parameters.root;
		_fileretriever = parameters.fileretriever;
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

		var path = require("path").normalize(_root + url);
		fileretriever.getFile(path, function(file, type) {
			response.writeHead(200, { "Content-Type": type, "Content-Length": file.length });
			response.end(file, "binary");
		}, function(error) {
			response.writeHead(404, { "Content-Type": "text/plain" });
			response.end(error);
		});
	};
})();
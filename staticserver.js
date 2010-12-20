//
//	A node.js module used to serve static content.
//
var StaticServer = function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The included http library.
	var _http;

	//	Retrieves files to be written.
	var _fileretriever;

	//	The root path.
	var _root;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	The default constructor.
	//	http:				The included http library
	// 	fileretriever:		Retrieves files to be written..
	//	root:				The root path.
	//
	exports.initialize = function(parameters) {
		_http = parameters.http;
		_fileretriever = parameters.fileretriever;
		_root = parameters.root;
	};

	//
	//	Runs the static server.
	//	port:				The port on which the server should listen for requests.
	//
	exports.run = function(port) {
		_http.createServer(function(request, response) {
			if (request.url.indexOf("favicon.ico") > -1)
				return;

			if (request.headers.range)
				handleStreamedFile(_fileretriever, request, response);
			else
				handleStaticFile(_fileretriever, request.url, response);
		}).listen(port, "127.0.0.1");

		console.log("Static server listening on " + port + ".");
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

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

}();

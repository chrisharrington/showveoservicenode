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

			handleStaticFile(_fileretriever, request.url, response);
		}).listen(port, "127.0.0.1");

		console.log("Static server listening on " + port + ".");
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Handles a request for a static file.
	//	fileretriever:			The file retriever application to invoke.
	//	url:					The url of the request.
	//	response:				The response object.
	//
	var handleStaticFile = function(fileretriever, url, response) {
		if (url == "/")
			url = "/index.html";

		var path = _root + url;
		fileretriever.getFile(path, function(file, type) {
			response.writeHead(200, { "Content-Type": type });
			response.end(file, "binary");
		}, function(error) {
			response.writeHead(404, { "Content-Type": "text/plain" });
			response.end(error);
		});
	};

}();

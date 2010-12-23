var router = function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The included path library.
	var _path;

	//	The root path.
	var _root;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the router class.
	//	path:				The included path library.
	//	root:					The root path.
	//
	exports.initialize = function(parameters) {
		_path = parameters.path;
		_root = parameters.root;
	};

	//
	//	Routes incoming requests to the right place.
	//	request:				The request to route.
	//	response:				The response to write.
	//
	exports.route = function(request, response) {
		route(request, response);
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

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
	//	Routes a request.
	//	request:				The request object.
	//	response:				The response object.
	//
	var route = function(request, response) {
		var url = request.url;
		if (url.indexOf("?") > -1)
			url = url.substring(0, url.indexOf("?"));
		var location = deriveRoutedPath(url, request.method);
		_path.exists(location, function(exists) {
			if (!exists) {
				url = replaceFinalUrlPart(request.url, "") + ".data";
				location = deriveRoutedPath(url, request.method);
				_path.exists(location, function(exists) {
					if (!exists)
						write404(request, response);
					else
						handle(location, request, response);
				});
			}
			else
				handle(location, request, response);
		});
	};

	//
	//	Appends the appropriate information to the given url to form a routed file path.
	//	url:					The url.
	//	method:				The method.
	//	Returns:				The produced routed file path.
	//
	var deriveRoutedPath = function(url, method) {
		return __dirname + url.replace(/.data/g, "." + method.toLowerCase() + ".js");
	};

	//
	//	Replaces the final url part with the given string.
	//	url:					The url to modify.
	//	replacement:			The replacement string.
	//	Returns:				The modified url.
	//
	var replaceFinalUrlPart = function(url, replacement) {
		var parts = url.split("/");
		parts[parts.length-1] = replacement;
		return parts.join("/");
	};

	//
	//	Writes a 404 error to the response.
	//	request:				The request object.
	//	response:				The response to write.
	//
	var write404 = function(request, response) {
		response.writeHead(404, { "Content-Type": "text/plain" });
		response.end("404 - The request for file \"" + request.url + "\" could not be completed because the file was not found.");
	};

	//
	//	Writes a 500 error to the response.
	//	request:				The request object.
	//	response:				The response to write.
	//
	var write500 = function(request, response) {
		response.writeHead(500, { "Content-Type": "text/plain" });
		response.end("500 - The request for file \"" + request.url + "\" resulted in an internal server error.  Please try again later.");
	};

	//
	//	Attempts to fire the handler at the given location.
	//	location:				The location of the handler to execute.
	//	request:				The request object.
	//	response:				The response object.
	//
	var handle = function(location, request, response) {
		try {
			require(location.replace(__dirname, ".").replace(".js", "")).handle(request, response);
		}
		catch (error) {
			console.log(error.toString());
			write500(request, response);
		}
	};

}();
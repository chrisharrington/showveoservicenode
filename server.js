//
//	The main server.  Delegates to handlers based on incoming requests.
//
var Server = {
	initialize: function(parameters) {

		//------------------------------------------------------------------------------------------------------------------
		/* Data Members */

		//	The included file system library.
		var _fs;

		//	The root path for all applications.
		var _root;

		//------------------------------------------------------------------------------------------------------------------

		_fs = parameters.fs;
		_root = parameters.root;

		parameters.movieservice.initialize("c26c67ed161834067f4d91430df1024e");

		parameters.http.createServer(function(request, response) {
			try {
				if (request.url.indexOf("favicon.ico") > -1)
					return;

				switch (deriveDirector(request.url)) {
					case "joiner": handleJoiner(parameters.filejoiner, request.url, response); break;
					case "upload": console.log("upload"); break;
					case "movie": handleMovie(parameters.movieservice, request, response); break;
					default: handleStaticFile(parameters.fileretriever, request.url, response); break;
				}
			}
			catch (error) {
				if (error && error.code) {
					response.writeHead(error.code, { "Content-Type": "text/plain" });
					response.end(error.message);
					console.log(error.code + ": " + error.mesage);
				}
				else {
					response.writeHead(500, { "Content-Type": "text/plain" });
					response.end("An internal server error has occurred.");
					console.log(error);
				}
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

			return;
		}

		//
		//	Handles a request to the joiner application.
		//	filejoiner:				The file joiner application to invoke.
		//	url:					The url of the request.
		//	response:				The response object.
		//
		var handleJoiner = function(filejoiner, url, response) {
			console.log("joiner:  " + url);

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
		}

		//
		//	Handles a request for a static file.
		//	fileretriever:			The file retriever application to invoke.
		//	url:					The url of the request.
		//	response:				The response object.
		//
		var handleStaticFile = function(fileretriever, url, response) {
			console.log("static:  " + url);

			var path = _root + url;
			fileretriever.getFile(path, function(file, type) {
				response.writeHead(200, { "Content-Type": type });
				response.end(file, "binary");
			}, function(error) {
				response.writeHead(404, { "Content-Type": "text/plain" });
				response.end(error);
			});
		}

		//
		//	Handles a request for movie information.
		//	movieservice:			The movie service application to invoke.
		//	request:				The request object.
		//	response:				The response object.
		//
		var handleMovie = function(movieservice, request, response) {
			try {
				var url = request.url.replace("/movie/", "");
				var parts = url.split("/");
				if (parts.length < 1)
					throw { code: 500, message: "No function specified for the movie service." };

				switch (parts[0]) {
					case "search": handleMovieSearch(movieservice, request, response); break;
					case "info": handleMovieInfo(movieservice, request, response); break;
					default: throw { code: 500, message: "No function specified for the movie service." };
				}
			}
			catch (error) {
				response.writeHead(error.code, { "Content-Type": "text/plain" });
				response.end(error.message);
			}
		}

		//
		//	Handles a movie search request.
		//	movieservice:			The movie service application to invoke.
		//	request:				The request object.
		//	response:				The response object.
		//
		var handleMovieSearch = function(movieservice, request, response) {
			console.log("movie search:  " + request.url);

			movieservice.search(request.url.replace("/movie/search/", ""), function(movies) {
				response.writeHead(200, { "Content-Type": "application/json" });
				response.end(movies);
			});
		}

		//
		//	Handles a request for detailed movie information.
		//	movieservice:			The movie service application to invoke.
		//	request:				The request object.
		//	response:				The response object.
		//
		var handleMovieInfo = function(movieservice, request, response) {
			console.log("movie info:  " + request.url);

			movieservice.info(request.url.replace("/movie/info/", ""), function(info) {
				response.writeHead(200, { "Content-Type": "application/json" });
				response.end(info);
			});
		}

	}
}.initialize({
	http: require("http"),
	port: 3000,
	root: "/home/chrisharrington/Code/showveo",
	filejoiner: require("./filejoiner"),
	fileretriever: require("./fileretriever"),
	movieservice: require("./movieservice")
});
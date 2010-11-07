//
//	A web service used to serve up static files.
//
var StatcFileServer = {
	initialize: function(parameters) {

		//------------------------------------------------------------------------------------------------------------------
		/* Data Members */

		//	The port on which the file server will be listening.
		var _port;

		//	The directory in which to look for files.
		var _directory;

		//------------------------------------------------------------------------------------------------------------------
		/* Constructors */

		_port = parameters.port;
		_directory = parameters.directory;

		parameters.http.createServer(function(request, response) {
			var uri = parameters.url.parse(request.url).pathname;
			var filename = parameters.path.join(_directory, uri);
			console.log(filename);
			parameters.path.exists(filename, function(exists) {
				if(!exists) {  
					response.writeHead(404, {"Content-Type": "text/plain"});
					response.write("404 Not Found\n");
					response.end();
					return;
				}

				parameters.fs.readFile(filename, "binary", function(err, file) {
					if(err) {
						response.writeHead(500, {"Content-Type": "text/plain"});
						response.write(err + "\n");
						response.end();
						return;
					}

					response.writeHead(200);
					response.write(file, "binary");
					response.end();
				});
			});
		}).listen(_port, "127.0.0.1");

		console.log("Static file server running on port " + _port + ".");

		//------------------------------------------------------------------------------------------------------------------
		/* Private Methods */

	}
}.initialize({
	http: require("http"),
	path: require("path"),
	url: require("url"),
	fs: require("fs"),
	port:3000,
	directory: "/home/chrisharrington/Code/showveo"
});
tester = new RegExp("ï»¿");
//tester = new RegExp("new");

//
//	A web service used to join together multiple files.
//
var FileJoiner = {
	initialize: function(parameters) {

		//------------------------------------------------------------------------------------------------------------------
		/* Data Members */

		//	The port the service will listen on.
		var _port = 3000;

		//	The home directory.
		var _directory

		//	The included file system library.
		var _fs;

		//------------------------------------------------------------------------------------------------------------------
		/* Constructors */

		_fs = parameters.fs;
		_port = parameters.port;
		_directory = parameters.directory;
		
		parameters.http.createServer(function(request, response) {
			if (request.url.indexOf("favicon.ico") > -1)
				return;

			var parsed = parseUrl(request.url);

			var files = new Array();
			getFiles(parameters.directory + "/" + parsed.path, new RegExp(/.js$/), files, function() {
				join(prioritize(files, new Array("jquery", "setup", "validator")), function(data) {
					response.writeHead(200, { "Content-Type": "text/plain" });
					response.end(data);
				});
			});
		}).listen(_port, "127.0.0.1");

		console.log("File joiner running on " + _port + ".");

		//------------------------------------------------------------------------------------------------------------------
		/* Private Methods */

		//
		//	Parses the incoming url and retrieves the requested information.
		//	url:				The url to parse.
		//	Returns:			An object comprising of the parsed path and extension.
		//
		var parseUrl = function(url) {
			try {
				var extension;

				var parts = url.split("/");
				var counter;
				for (counter = 0; counter < parts.length; counter++) {
					if (parts[counter] == "")
						continue;
					extension = parts[counter];
					break;
				}

				return { extension: extension, path: parts.slice(++counter, parts.length).join("/") };
			}
			catch (error) {
				console.log(error);
				return;
			}
		}

		//
		//	Recursively retrieves the file list.
		//	path:				The path of the directory containing the files to check.
		//	tester:				The regular expression object used to test for valid files.
		//	list:				The list to which file paths should be pushed.
		//	callback:			The callback function to execute once all files have been read.
		//
		var getFiles = function(path, tester, list, callback) {
			_fs.readdir(path, function(a, files) {
				if (files.length == 0) {
					callback(list);
					return;
				}

				var counter = 0;
				var checkFileCallback = function() {
					if (counter < files.length)
						checkFile(path + "/" + files[counter++], tester, list, checkFileCallback);
					else
						callback(list);
				}

				checkFile(path + "/" + files[counter++], tester, list, checkFileCallback);
			});
		}

		//
		//	Checks the file to see if it's a valid match.
		//	path:				The path of the file.
		//	tester:				The regular expression object used to test if the given file is valid.
		//	list:				The list to which file paths should be pushed.
		//	callback:			The callback function to execute once the file has been checked.
		//
		var checkFile = function(path, tester, list, callback) {
			_fs.stat(path, function(a, stats) {
				if (stats.isFile() && tester.test(path))
					list.push(path);

				if (stats.isDirectory())
					getFiles(path, tester, list, callback);
				else
					callback();
			});
		}

		//
		//	Prioritizes the list of files.
		//	list:				The file list.
		//	priorities:			The priorities list.
		//	Returns:			The prioritized list of files.
		//
		var prioritize = function(list, priorities) {
			if (priorities.length == 0)
				return;

			var testers = new Array();
			for (var i = 0; i < priorities.length; i++)
				testers.push(new RegExp(priorities[i] + ".js$"));
			var location = priorities.length-1;
			for (var i = 0; i < list.length; i++) {
				for (var j = 0; j < testers.length; j++) {
					if (testers[j].test(list[i]))
					{
						var temp = list[i];
						list[i] = list[j];
						list[j] = temp;
					}
				}
			}

			return list;
		}

		//
		//	Joins files together.
		//	files:				The list of files to join together.
		//	callback:			The callback function to execute once all files have been joined.
		//
		var join = function(files, callback) {
			var data = "";

			if (!files || files.length == 0)
				return;

			var counter = 0;
			var readFileCallback = function(contents) {
				data += contents;
				if (counter < files.length)
					readFile(files[counter++], readFileCallback);
				else
					callback(data);
			}

			readFile(files[counter++], readFileCallback);
		}

		//
		//	Reads the contents of a file.
		//	path:				The path of the file.
		//	callback:			The callback function to execute once the file has been read.
		//
		var readFile = function(path, callback) {
			_fs.readFile(path, "UTF8", function(a, data) {
				callback(data);
			});
		}
	}

}.initialize({
	port: 3001,
	directory: "/home/chrisharrington/Code/showveo",
	http: require("http"),
	fs: require("fs")
});
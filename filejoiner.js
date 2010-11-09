//
//	Joins files with a common extension together.
//	fs:					The included file system library.
//	path:				The root path.
//	extension:			THe extension of joined files.
//	callback:			The callback function to fire with the joined data.
//
exports.join = function(parameters) {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The included file system library.
	var _fs;

	//	The root path.
	var _root;

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Recursively retrieves the file list.
	//	path:				The path of the directory containing the files to check.
	//	tester:				The regular expression object used to test for valid files.
	//	list:				The list to which file paths should be pushed.
	//	callback:			The callback function to execute once all files have been read.
	//
	var getFiles = function(path, tester, list, callback) {
		_fs.readdir(path, function(a, files) {
			if (!files || files.length == 0) {
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

		if (!files || files.length == 0) {
			callback("");
			return;
		}

		var counter = 0;
		var readFileCallback = function(contents) {
			data += contents;
			if (counter < files.length)
				readFile(files[counter++], readFileCallback);
			else
				callback(data);
		};

		readFile(files[counter++], readFileCallback);
	};

	//
	//	Reads the contents of a file.
	//	path:				The path of the file.
	//	callback:			The callback function to execute once the file has been read.
	//
	var readFile = function(path, callback) {
		_fs.readFile(path, "UTF8", function(a, data) {
			callback(data);
		});
	};

	//------------------------------------------------------------------------------------------------------------------

	_fs = require("fs");
	_root = parameters.root;

	var files = new Array();
	getFiles(_root + "/" + parameters.path, new RegExp(parameters.extension + "$"), files, function() {
		join(prioritize(files, new Array("jquery", "setup", "validator")), function(data) {
			parameters.callback(data);
		});
	});
};
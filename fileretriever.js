//
//	Retrieves files on request.
//	path:					The path of the file to retrieve.
//	success:				The callback function to call with the file data.
//	error:					The callback function to fire when an error occurs.
//
exports.getFile = function(path, success, error) {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The included path library.
	var _path;

	//	The included file system library.
	var _fs;

	//------------------------------------------------------------------------------------------------------------------
	
	_path = require("path");
	_fs = require("fs");

	_path.exists(path, function(exists) {
		if(!exists) {
			error("The file could not be found.");;
			return;
		}

		_fs.readFile(path, "binary", function(err, file) {
			if(err) {
				error(err);
				return;
			}

			success(file, deriveMimeType(path));
		});
	});

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Derives the mime type from the extension of the requested file.
	//	url:				The url of the file.
	//	Returns:			The presumptuous mime type.
	//
	var deriveMimeType = function(url) {
		switch (url.substring(url.lastIndexOf("."))) {
			case ".jpg": return "image/jpeg";
			case ".gif": return "image/gif";
			case ".png": return "image/png";
			case ".css": return "text/css";
			case ".html" || ".htm": return "text/html";
			case ".xml": return "text/xml";
			default: return "text/plain";
		}
	}
}
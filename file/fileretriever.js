//
//	A class used to retrieve a file for reading.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Retrieves a portion of a file.
	//	path:					The path of the file.
	//	bounds:					Contains "start" and "end", referring to the lower and upper bounds of the portion.
	//	success:				The success callback.
	//	error:					The error callback.
	//
	exports.getPortionOfFile = function(path, bounds, success, error) {
		if (!bounds)
			bounds = { start: 0, end: 0 };
		if (!bounds.start)
			bounds.start = 0;
		if (!bounds.end)
			bounds.end = 0;

		require("path").exists(path, function(exists) {
			if (!exists) {
				error("The file could not be found.");
				return;
			}

			var fs = require("fs");
			fs.stat(path, function(err, stats) {
				if (err) {
					error("The file size could not be determined.");
					return;
				}

				var start = bounds.start;
				var end = bounds.end;

				if (start > stats.size)
					start = stats.size;
				if (end == 0 || end < start || end > stats.size)
					end = stats.size;
				if (start < 0)
					start = 0;

				var buffer = new Buffer(end - start);
				var count = 0;
				var stream = require("fs").createReadStream(path, { start: start, end: end });
				stream.on("data", function(data) {
					data.copy(buffer, count);
					count += data.length;
				});
				stream.on("end", function() {
					success(buffer, stats.size, deriveMimeType(path));
				});
			});
		});
	};

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
			case ".ogv": return "application/ogg";
			case ".full": return "video/mp4";
			case ".mobile": return "video/mp4";
			case ".mp4": return "video/mp4";
			default: return "text/plain";
		}
	}

})();
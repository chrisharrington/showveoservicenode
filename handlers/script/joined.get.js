//
//	Handles a request for a join operation.
//
var joined_get = function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The file joiner which is called to join files together.
	var _fileJoiner;

	//	The root path.
	var _root;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the handler.
	//	fileJoiner:				The file joiner which is called to join files together.
	//	root:					The root path.
	//
	exports.initialize = function(parameters) {
		_fileJoiner = parameters.fileJoiner;
		_root = parameters.root;
	};

	//
	//	Handles an incoming request.
	//	request:				The request object.
	//	response:				The response object.
	//
	exports.handle = function(request, response) {
		_fileJoiner.join({
			root: _root,
			path: "",
			extension: "js",
			callback: function(data) {
				response.writeHead(200, { "Content-Type": "text/plain" });
				response.end(data);
			}
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

}();
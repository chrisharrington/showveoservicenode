//
//	Handles a request for a template operation.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the handler.
	//
	exports.initialize = function(parameters) {

	};

	//
	//	Handles an incoming request.
	//	request:				The request object.
	//	response:				The response object.
	//
	exports.handle = function(request, response) {
		var uncategorizedMovieID = request.data.uncategorizedMovieID;
		var movieInfoID = request.data.infoID;

		

		response.writeHead(200, { "Content-Type": "application/json" });
		response.end("{}");
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

})();

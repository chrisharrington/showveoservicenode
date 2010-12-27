//
//	Handles a request for a retrieval of recent movies operation.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	A container for movie information.
	var _movieRepository;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the handler.
	//	movieRepository:			A container for movie information.
	//
	exports.initialize = function(parameters) {
		_movieRepository = parameters.movieRepository;
	};

	//
	//	Handles an incoming request.
	//	request:				The request object.
	//	response:				The response object.
	//
	exports.handle = function(request, response) {
		_movieRepository.getRecent(5, {
			success: function(movies) {
				response.writeHead(200, { "Content-Type": "application/json" });
				response.end(JSON.stringify(movies));
			},
			error: function() {
				response.writeHead(500, { "Content-Type": "plain/text" });
				response.end("An error has occurred while retrieving the recent movies list.");
			}
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

})();

//
//	Handles a request for a retrieval of recent movies operation.
//
var getFavoriteMovies = function() {

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
		_movieRepository.getFavorites({
			success: function(movies) {
				response.writeHead(200, { "Content-Type": "application/json" });
				response.end(JSON.stringify(movies));
			},
			error: function() {
				response.writeHead(500, { "Content-Type": "plain/text" });
				response.end("An error has occurred while retrieving the favorite movies list.");
			}
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

}();

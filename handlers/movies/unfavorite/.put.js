//
//	Handles a request for a movie unfavorite operation.
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
	//	movieRepository:		A container for movie information.
	//
	exports.initialize = function(parameters) {
		_movieRepository = parameters.movieRepository;
	};

	//
	//	Handles an incoming request.
	//	request:				The request object.
	//	response:				The response object.
	//	movieID:				The ID of the movie to set as a favorite.
	//
	exports.handle = function(request, response, movieID) {
		_movieRepository.setFavorite(movieID, false, {
			success: function() {
				response.writeHead(200, { "Content-Type": "application/xml" });
				response.end("<empty></empty>");
			},
			error: function(error) {
				response.writeHead(500, { "Content-Type": "plain/text" });
				response.end("An error has occurred while setting a movie's favorite status.");
			}
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

})();

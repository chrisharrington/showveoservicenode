//
//	Handles a request for a template operation.
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
	//	movieName:				The raw movie name.
	//
	exports.handle = function(request, response, movieName) {
		movieName = movieName.replace(/_/g, " ");

		var title = movieName.substring(0, movieName.lastIndexOf(" "));
		var year = movieName.substring(movieName.lastIndexOf(" ")+1);

		_movieRepository.getByTitleAndYear(title, year, {
			success: function(movie) {
				response.writeHead(200, { "Content-Type": "application/json" });
				response.end(JSON.stringify(movie));
			},
			error: function(error) {
				response.writeHead(500, { "Content-Type": "plain/text" });
				response.end(error);
			}
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

})();

//
//	Handles a request for a movie search operation.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	A container for detailed movie information.
	var _movieInfoRepository;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the handler.
	//	movieInfoRepository:	A container for detailed movie information.
	//
	exports.initialize = function(parameters) {
		_movieInfoRepository = parameters.movieInfoRepository;
	};

	//
	//	Handles an incoming request.
	//	request:				The request object.
	//	response:				The response object.
	//
	exports.handle = function(request, response, query) {
		console.log("search: " + query);

		_movieInfoRepository.search(query, {
			success: function(infos) {
				response.writeHead(200, { "Content-Type": "application/json" });
				response.end(JSON.stringify(infos));
			},
			error: function() {
				response.writeHead(500, { "Content-Type": "plain/text" });
				response.end("An error has occurred while performing a search for movie information.");
			}
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

})();


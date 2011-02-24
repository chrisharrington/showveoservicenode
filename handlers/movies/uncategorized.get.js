//
//	Handles a request for an uncategorized movie retrieval operation.
//
var template = function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	A container for uncategorized movie information.
	var _uncategorizedMovieRepository;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the handler.
	//	uncategorizedMovieRepository:			A container for uncategorized movie information.
	//
	exports.initialize = function(parameters) {
		_uncategorizedMovieRepository = parameters.uncategorizedMovieRepository;
	};

	//
	//	Handles an incoming request.
	//	request:				The request object.
	//	response:				The response object.
	//
	exports.handle = function(request, response) {
		_uncategorizedMovieRepository.getAll({
			success: function(movies) {
				response.writeHead(200, { "Content-Type": "application/json" });
				response.end(JSON.stringify(movies));
			},
			error: function() {
				response.writeHead(500, { "Content-Type": "plain/text" });
				response.end("An error has occurred while retrieving all uncategorized movies.");
			}
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

}();


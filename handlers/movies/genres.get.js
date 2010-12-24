//
//	Handles a request for a genre retrieval operation.
//
var template = function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	A container for genre information.
	var _genreRepository;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the handler.
	//	genreRepository:		A container for genre information.
	//
	exports.initialize = function(parameters) {
		_genreRepository = parameters.genreRepository;
	};

	//
	//	Handles an incoming request.
	//	request:				The request object.
	//	response:				The response object.
	//
	exports.handle = function(request, response) {
		_genreRepository.getAll({
			success: function(genres) {
				response.writeHead(200, { "Content-Type": "application/json" });
				response.end(JSON.stringify(genres));
			},
			error: function(error) {
				response.writeHead(500, { "Content-Type": "plain/text" });
				response.end("An error has occurred while retrieving the genre list:  " + error);
			}
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

}();


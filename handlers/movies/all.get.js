//
//	Handles a request for a retrieval of recent movies operation.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	A container for movie information.
	var _movieRepository;

	//	A container for user information.
	var _userRepository;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the handler.
	//	movieRepository:			A container for movie information.
	//	userRepository:			A container for user information.
	//
	exports.initialize = function(parameters) {
		_movieRepository = parameters.movieRepository;
		_userRepository = parameters.userRepository;
	};

	//
	//	Handles an incoming request.
	//	request:				The request object.
	//	response:				The response object.
	//
	exports.handle = function(request, response) {
		_userRepository.getByIdentity(request.identity, {
			success: function(user) {
				_movieRepository.getAll(user, {
					success: function(movies) {
						response.writeHead(200, { "Content-Type": "application/json" });
						response.end(JSON.stringify(movies));
					},
					error: function() {
						response.writeHead(500, { "Content-Type": "plain/text" });
						response.end("An error has occurred while retrieving the complete list.");
					}
				});
			}
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

})();


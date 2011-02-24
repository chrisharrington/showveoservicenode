//
//	Handles a request for a retrieval of recent movies operation.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	A container for user-movie information.
	var _userMovieRepository;

	//	A container for user information.
	var _userRepository;

	//	Converts objects into their json representations.
	var _stringifier;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the handler.
	//	userMovieRepository:	A container for user-movie information.
	//	userRepository:			A container for user information.
	//	stringifier:			Converts objects into their json representations.
	//
	exports.initialize = function(parameters) {
		_userMovieRepository = parameters.userMovieRepository;
		_userRepository = parameters.userRepository;
		_stringifier = parameters.stringifier;
	};

	//
	//	Handles an incoming request.
	//	request:				The request object.
	//	response:				The response object.
	//
	exports.handle = function(request, response) {
		_userRepository.getByIdentity(request.identity, {
			success: function(user) {
				_userMovieRepository.getFavoritesByUser(user, {
					success: function(infos) {
						response.writeHead(200, { "Content-Type": "application/json" });
						response.end(_stringifier.stringify(infos));
					},
					error: function() {
						response.writeHead(500, { "Content-Type": "plain/text" });
						response.end("An error has occurred while retrieving the favorite movies list.");
					}
				});
			}
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

})();

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

	//	An object used to merge movie and user information.
	var _userMovieMerger;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the handler.
	//	movieRepository:			A container for movie information.
	//	userRepository:			A container for user information.
	//	userMovieMerger:			Merges user-movie info objects.
	//
	exports.initialize = function(parameters) {
		_movieRepository = parameters.movieRepository;
		_userRepository = parameters.userRepository;
		_userMovieMerger = parameters.userMovieMerger;
	};

	//
	//	Handles an incoming request.
	//	request:				The request object.
	//	response:				The response object.
	//
	exports.handle = function(request, response) {
		_userRepository.getByIdentity(request.identity, {
			success: function(user) {
				_movieRepository.getFavorites(user, {
					success: function(infos) {
						response.writeHead(200, { "Content-Type": "application/json" });
						response.end(JSON.stringify(_userMovieMerger.mergeList(infos)));
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

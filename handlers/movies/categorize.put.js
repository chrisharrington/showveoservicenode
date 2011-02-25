//
//	Handles a request for a template operation.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	A container of detailed movie information.
	var _movieInfoRepository;

	//	A container for uncategorized movie information.
	var _uncategorizedMovieRepository;

	//	A container for movie information.
	var _movieRepository;

	//	A container for user information.
	var _userRepository;

	//	A container for user-movie information.
	var _userMovieRepository;

	//	Creates guids.
	var _guidFactory;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the handler.
	//	uncategorizedMovieRepository:		A container for uncategorized movie information.
	//	movieInfoRepository:				A container for detailed movie information.
	//	movieRepository:					A container for movie information.
	//	userRepository:						A container for user information.
	//	userMovieRepository:				A container for user-movie information.
	//	guidFactory:						Creates quids.
	//
	exports.initialize = function(parameters) {
		_uncategorizedMovieRepository = parameters.uncategorizedMovieRepository;
		_movieInfoRepository = parameters.movieInfoRepository;
		_movieRepository = parameters.movieRepository;
		_userRepository = parameters.userRepository;
		_userMovieRepository = parameters.userMovieRepository;
		_guidFactory = parameters.guidFactory;
	};

	//
	//	Handles an incoming request.
	//	request:				The request object.
	//	response:				The response object.
	//
	exports.handle = function(request, response) {
		var uncategorizedMovieID = request.data.uncategorizedMovieID;
		var movieInfoID = request.data.infoID;

		_userRepository.getByIdentity(request.identity, {
			success: function(user) {
				_movieInfoRepository.getByID(movieInfoID, {
					success: function(movie) {
						movie.id = _guidFactory.create().value;
						_movieRepository.insert(movie, {
							success: function(movie) {
								_userMovieRepository.insert({ user: user, movie: movie }, {
									success: function() {},
									error: function() {}
								});

								_uncategorizedMovieRepository.getByID(uncategorizedMovieID, {
									success: function(uncategorizedMovie) {
										uncategorizedMovie.categorizedMovieID = movie.id;
										_uncategorizedMovieRepository.update(uncategorizedMovie, {
											success: function() {
												response.writeHead(200, { "Content-Type": "application/json" });
												response.end("{}");
											},
											error: function() {
												writeError(response, "An error has occurred while updating the uncategorized movie.");
											}
										});
									},
									error: function() {
										writeError(response, "An error has occurred while retrieving the uncategorized movie information.");
									}
								});
							},
							error: function() {
								writeError(response, "An error has occurred while inserting the newly categorized movie.");
							}
						});
					},
					error: function() {
						writeError(response, "An error has occurred while retrieving the movie information.");
					}
				});
			}
		});		
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Writes an error to the response.
	//	response:				The response object.
	//	error:				The error to write.
	//
	var writeError = function(response, error) {
		response.writeHead(500, { "Content-Type": "plain/text" });
		response.end(error);
	};

})();

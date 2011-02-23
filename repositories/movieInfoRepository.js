//
//	A container for detailed movie information.
//	db:				The underlying database connection.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The error logger.
	var _logger;

	//	The underlying remote movie service.
	var _service;

	//	Maps remote movie information to local movie objects.
	var _mapper;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Creates the repository.
	//	logger:		The error logger.
	//	service:	The underlying remote movie service.
	//	mapper:		Maps remote movie information to local movie objects.
	//
	exports.create = function(logger, service, mapper) {
		_logger = logger;
		_service = service;
		_mapper = mapper;

		_mapper.initialize()
	};

	//
	//	Searches for movie information using the given name as a search query.
	//	name:		The search query.
	//	handlers:		The function handlers.
	//
	exports.search = function(name, handlers) {
		try {
			if (!name)
				throw "The given search query is invalid.";

			_service.search(name, function(movies) {
				if (handlers.success)
					handlers.success(movies);
			}, function(error) {
				if (handlers.error)
					handlers.error(error);
			});
		} catch (error) {
			_logger.log("movieInfoRepository.search:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

	//
	//	Retrieves detailed movie information.
	//	id:			The ID of the movie.
	//	handlers:		The function handlers.
	//
	exports.getByID = function(id, handlers) {
		try {
			if (!id)
				throw "The given ID is invalid.";

			_service.getByID(id, {
				success: function(movie) {
					_mapper.map(movie, function(mapped) {
						if (handlers.success)
							handlers.success(mapped);
					});
				},
				error: function(error) {
					if (handlers.error)
						handlers.error(error);
				}
			});
		} catch (error) {
			_logger.log("movieInfoRepository.getByID:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

})();


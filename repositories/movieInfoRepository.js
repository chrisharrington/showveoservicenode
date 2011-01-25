//
//	A container for detailed movie information.
//	db:				The underlying database connection.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The underlying database object.
	var _db;

	//	The error logger.
	var _logger;

	//	The underlying remote movie service.
	var _service;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Creates the repository.
	//	db:			The underlying database object.
	//	logger:		The error logger.
	//	service:		The underlying remote movie service.
	//
	exports.create = function(db, logger, service) {
		_db = db;
		_logger = logger;
		_service = service;
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

			handlers.success(new Array());
		} catch (error) {
			_logger.log("movieInfoRepository.search:  " + error);
			if (handlers.error)
				handlers.error(error);
		}
	};

})();


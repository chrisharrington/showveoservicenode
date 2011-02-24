//
//	A container for user-movie information.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The underlying database object.
	var _db;

	//	The error logger.
	var _logger;

	//	The guid object used to generate new unique IDs.
	var _guid;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Creates the repository.
	//	db:					The underlying database object.
	//
	exports.create = function(db) {
		_db = db;
		return this;
	};

	//
	//	Removes all user-movie relationships.
	//	handlers:			The function handlers.
	//
	exports.removeAll = function(handlers) {
		_db.removeAll("usermovieinfos", handlers);
	};

	//
	//	Inserts a user-movie info object.
	//	info:			The user movie info object to insert.
	//	handlers:		The function handlers.
	//
	exports.insert = function(info, handlers) {
		_db.insert("usermovieinfos", info, handlers);
	};

	//
	//	Retrieves a collection of all user-movie info objects by user.
	//	user:			The user.
	//	handlers:		The function handlers.
	//
	exports.getByUser = function(user, handlers) {
		_db.find("usermovieinfos", { "user._id": user._id }, { "sort": [["movie.name", 1]]}, handlers);
	};

	//
	//	Retrieves a collection of favorite movies for a user.
	//	user:			The user.
	//	handlers:		The function handlers.
	//
	exports.getFavoritesByUser = function(user, handlers) {
		_db.find("usermovieinfos", { "user._id": user._id, isFavorite: true }, { "sort": [["movie.name", 1]]}, handlers);
	};

	//
	//	Retrieves a list of recent movies by user.
	//	user:			The user.
	//	count:			The number of user-movie info objects to retrieve.
	//	handlers:		The function handlers.
	//
	exports.getRecentByUser = function(user, count, handlers) {
		_db.find("usermovieinfos", { "user._id": user._id }, { "limit": count, "sort": [["movie.uploadDate", 1]]}, handlers);		
	};

	//
	//	Retrieves a list of user-movie infos by genre of the movie for a user.
	//	user:			The user.
	//	genre:			The genre.
	//	handlers:		The function handlers.
	//
	exports.getGenreByUser = function(user, genre, handlers) {
		_db.find("usermovieinfos", { "user._id": user._id }, { "sort": [["movie.name", 1]]}, {
			success: function(retrieved) {
				var infos = new Array();
				retrieved.forEach(function(info) {
					for (var i = 0; i < info.movie.genres.length; i++) {
						if (info.movie.genres[i].name == genre) {
							infos.push(info);
							break;
						}
					}
				});
				handlers.success(infos);
			},
			error: function(error) {
				handlers.error(error);
			}
		});
	};

	//
	//	Sets the favorite status of the user-movie model.
	//	user:			The user.
	//	movieID:		The ID of the movie whose favorite status is being modified.
	//	isFavorite:		A flag indicating the favorite status of the movie.
	//	handlers:		The function handlers.
	//
	exports.setFavorite = function(user, movieID, isFavorite, handlers) {
		_db.update("usermovieinfos", movieID, { isFavorite: isFavorite }, handlers);
	};

})();

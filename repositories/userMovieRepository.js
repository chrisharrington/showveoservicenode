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
		_db.insert("usermovieinfos", { "userID": info.user.id, "movieID": info.movie.id, "isFavorite": info.isFavorite }, handlers);
	};

	//
	//	Retrieves a collection of all user-movie info objects by user.
	//	user:			The user.
	//	handlers:		The function handlers.
	//
	exports.getAllByUser = function(user, handlers) {
		_db.find("usermovieinfos", { "userID": user.id }, { "sort": [["movie.name", 1]]}, {
			error: function(error) { handlers.error(error); },
			success: function(infos) { assignMovieAndUserInfo(infos, user, handlers.success); }
		});
	};

	//
	//	Retrieves a collection of favorite movies for a user.
	//	user:			The user.
	//	handlers:		The function handlers.
	//
	exports.getFavoritesByUser = function(user, handlers) {
		_db.find("usermovieinfos", { "userID": user.id, "isFavorite": true }, { "sort": [["movie.name", 1]]}, {
			error: function(error) { handlers.error(error); },
			success: function(infos) { assignMovieAndUserInfo(infos, user, handlers.success); }
		});
	};

	//
	//	Retrieves a list of recent movies by user.
	//	user:			The user.
	//	count:			The number of user-movie info objects to retrieve.
	//	handlers:		The function handlers.
	//
	exports.getRecentByUser = function(user, count, handlers) {
		_db.find("usermovieinfos", { "userID": user.id }, { "limit": count }, {
			error: function(error) { handlers.error(error); },
			success: function(infos) {
				assignMovieAndUserInfo(infos, user, function(infos) {
					infos.sort(function(first, second) {
						if (first.movie.uploadDate > second.movie.uploadDate)
							return -1;
						else if (first.movie.uploadDate == second.movie.uploadDate)
							return 0;
						else
							return 1;
					});
					handlers.success(infos);
				});
			}
		});
	};

	//
	//	Retrieves a list of user-movie infos by genre of the movie for a user.
	//	user:			The user.
	//	genre:			The genre.
	//	handlers:		The function handlers.
	//
	exports.getGenreByUser = function(user, genre, handlers) {
		_db.find("usermovieinfos", { "userID": user.id }, { "sort": [["movie.name", 1]]}, {
			success: function(infos) {
				var newInfos = new Array();
				assignMovieAndUserInfo(infos, user, function(retrieved) {
					retrieved.forEach(function(info) {
						var movie = info.movie;
						for (var i = 0; i < movie.genres.length; i++) {
							if (movie.genres[i].name == genre) {
								newInfos.push(info);
								break;
							}
						}
					});

					handlers.success(newInfos);
				});
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
		_db.update("usermovieinfos", { "userID": user.id, "movieID": movieID }, { "isFavorite": isFavorite }, handlers);
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Retrieves a list of movie objects from a collection of user-movie information objects.
	//	infos:			The collection of user-movie info objects.
	//	user:			The user object.
	//	callback:		The function handlers.
	//
	var assignMovieAndUserInfo = function(infos, user, callback) {
		if (infos.length == 0)
			callback(infos);

		var movies = new Array();
		for (var i = 0; i < infos.length; i++) {
			infos[i].user = user;
			var getMovie = function(index) {
				_db.findOne("movies", { id: infos[index].movieID }, {
					error: function() { console.log("An error has occurred while retrieving movies from a user-movie info collection."); },
					success: function(movie) {
						movies.push({ movie: movie, index: index });
						if (movies.length == infos.length) {
							movies.forEach(function(container) {
								infos[container.index].movie = container.movie;
							});

							callback(infos);
						}
					}
				});
			};

			getMovie(i);
		}
	};

})();

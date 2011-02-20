//
//	Maps movie information retrieved from http://themoviedb.org into a local movie model.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	A container for genre information.
	var _genreRepository;

	//	The movie model.
	var _movie;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the mapper.
	//	genreRepository:	A container for genre information.
	//	movie:				The movie model.
	//
	exports.initialize = function(genreRepository, movie) {
		_genreRepository = genreRepository;
		_movie = movie;
	};

	//
	//	Maps remote movie information to a local movie object.
	//	data:				The remote movie data.
	//	callback:			The callback function.
	//
	exports.map = function(data, callback) {
		var created = new _model({
			name: data.name,
			year: data.released.substring(0, 4),
			synopsis: data.overview,
			uploadDate: new Date(),
			lastWatched: null,
			lastWatchedDate: null,
			poster: derivePoster(data.posters),
			director: deriveDirector(data.cast),
			actors: deriveActors(data.cast, 5),
			isFavorite: false,
			url: "",
			encoded: false
		});

		deriveGenres(data.genres, function(genres) {
			created.genres = genres;
			callback(created);
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Derives local genres from remote genre information.
	//	data:				The remote genre information.
	//	callback:			The callback function.
	//
	var deriveGenres = function (data, callback) {
		var collection = new Array();
		data.forEach(function(genre) {
			genre = genre.name;
			_genreRepository.getByName(genre, {
				success: function(retrieved) {
					if (retrieved) {
						collection.push(retrieved);
						if (collection.length == data.length)
							callback(collection);
					}
					else {
						_genreRepository.insert({ name: genre }, {
							success: function(inserted) {
								collection.push(inserted);
								if (collection.length == data.length)
									callback(collection);
							}
						});
					}
				}
			});
		});
	};

	//
	//	Derives a poster url.
	//	images:			The collection of image data.
	//	Returns:			A poster url.
	//
	var derivePoster = function (images) {
		var url = "";
		for (var i = 0; i < images.length; i++) {
			var image = images[i].image;
			if (image.type == "poster" && image.size == "original")
				return image.url;
			else if (image.type == "poster" && !url)
				url = image.url;
		}
		return url;
	};

	//
	//	Derives the director.
	//	cast:				The cast of the movie.
	//	Returns:			The director's name.
	//
	var deriveDirector = function (cast) {
		for (var i = 0; i < cast.length; i++) {
			var person = cast[i];
			if (person.job.toLowerCase() == "director") {
				return person.name;
			}
		}
		return "";
	};

	//
	//	Derives a list of actors.
	//	cast:				The cast of the movie.
	//	max:				The maximum number of actors to derive.
	//	Returns:			A collection of actor names.
	//
	var deriveActors = function (cast, max) {
		var count = 0;
		var actors = new Array();
		for (var i = 0; i < cast.length; i++) {
			var person = cast[i];
			if (person.job.toLowerCase() == "actor") {
				actors.push(person.name);
				count++;
			}

			if (count >= max)
				break;
		}
		return actors;
	};

})();

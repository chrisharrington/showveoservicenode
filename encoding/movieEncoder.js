//
//	Encodes movie files.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The base encoder.
	var _encoder;

	//	The included file system library.
	var _fs;

	//	Generates guids.
	var _guidFactory;

	//	A container for uncategorized movie information.
	var _uncategorizedMovieRepository;

	//	A container for movie information.
	var _movieRepository;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the encoder.
	//	encoder:				The base encoder.
	//	fs:					The included file system library.
	//	repository:			A container for uncategorized movie information.
	//	movieRepository:		A container for movie information.
	//	guidFactory:			Generates guids.
	//
	exports.initialize = function(encoder, fs, repository, movieRepository, guidFactory) {
		_encoder = encoder;
		_fs = fs;
		_uncategorizedMovieRepository = repository;
		_movieRepository = movieRepository;
		_guidFactory = guidFactory;
	};

	//
	//	Encodes a movie.
	//	original:				The original filename.
	//	path:				The path of the movie to encode.
	//
	exports.encode = function(original, path) {
		var parts = path.split("/");
		var filename = parts[parts.length-1];

		var movie = {
			id: _guidFactory.create().value,
			filename: original,
			createdDate: new Date(),
			encoded: false
		};

		_uncategorizedMovieRepository.insert(movie, {
			success: function(insertedMovie) {
				var output = path.replace(".raw", ".mp4");
				_encoder.encode(path, output, function() {
					_fs.unlink(path);

					console.log("Movie encoded.");

					_uncategorizedMovieRepository.getByID(insertedMovie.id, {
						success: function(retrievedMovie) {

							var id = retrievedMovie.categorizedMovieID;
							if (retrievedMovie.categorizedMovieID) {
								_movieRepository.getByID(id, {
									success: function(categorizedMovie) {
										if (categorizedMovie) {
											categorizedMovie.encoded = true;
											categorizedMovie.url = output.substring(output.lastIndexOf("/")+1);
											_movieRepository.update(categorizedMovie);
										}
									}
								});
							}

							retrievedMovie.encoded = true;
							_uncategorizedMovieRepository.update(retrievedMovie);
						}
					});
				}, function() {
					console.log("error");
				});
			},
			error: function(error) { console.log("error: " + error) ; }
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Event Handlers */

})();

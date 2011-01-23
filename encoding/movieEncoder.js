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

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the encoder.
	//	encoder:				The base encoder.
	//	fs:					The included file system library.
	//	repository:			A container for uncategorized movie information.
	//	guidFactory:			Generates guids.
	//
	exports.initialize = function(encoder, fs, repository, guidFactory) {
		_encoder = encoder;
		_fs = fs;
		_uncategorizedMovieRepository = repository;
		_guidFactory = guidFactory;
	};

	//
	//	Encodes a movie.
	//	path:				The path of the movie to encode.
	//
	exports.encode = function(path) {
		var parts = path.split("/");
		var filename = parts[parts.length-1];

		var movie = {
			id: _guidFactory.create().value,
			filename: filename.replace(".raw", ""),
			createdDate: new Date(),
			encoded: false
		};

		_uncategorizedMovieRepository.insert(movie, {
			success: function(insertedMovie) {
				var output = path.replace(".raw", ".mp4");
				_encoder.encode(path, output, function() {
					_fs.rename(output, output.replace(".mp4", ""), function() {
						insertedMovie.encoded = true;
						_uncategorizedMovieRepository.update(insertedMovie, {
							success: function() {
								console.log("success!");
							}
						});
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

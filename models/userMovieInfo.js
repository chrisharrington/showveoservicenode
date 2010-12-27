//
//	Creates a mongoose user-movie info model.
//	mongoose:				The mongoose instance.
//
exports.create = function(mongoose) {
	if (!mongoose)
		return;

	mongoose.model("UserMovieInfo", {
		properties: [
			"user",
			"movie",
			"isFavorite"
		]
	});
};

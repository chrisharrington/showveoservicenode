//
//	Creates a mongoose user-movie info model.
//	mongoose:				The mongoose instance.
//	user:					The user model.
//	movie:					The movie model.
//
exports.create = function(mongoose, user, movie) {
	if (!mongoose)
		return;

	mongoose.model("UserMovieInfo", new mongoose.Schema({
		"user": [user],
		"movie": [movie],
		"isFavorite": Boolean
	}));
};

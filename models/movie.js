//
//	Creates a mongoose movie model.
//	mongoose:				The mongoose instance.
//	user:					The user model.
//	genre;					The genre model.
//
exports.create = function(mongoose, user, genre) {
	if (!mongoose)
		return;

	var movie = new mongoose.Schema({
		id: String,
		name: String,
		year: Number,
		synopsis: String,
		genres: [mongoose.model("Genre")],
		uploadDate: Date,
		lastWatched: [mongoose.model("User")],
		lastWatchedDate: Date,
		poster: String,
		director: String,
		actors: [String],
		url: String,
		encoded: Boolean
	});
	mongoose.model("Movie", movie);
	return movie;
};


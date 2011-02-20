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
		id: Number,
		name: String,
		year: Number,
		synopsis: String,
		genres: [[genre]],
		uploadDate: Date,
		lastWatched: [user],
		lastWatchedDate: Date,
		poster: String,
		director: String,
		actors: String,
		url: String,
		encoded: Boolean
	});
	mongoose.model("Movie", movie);
	return movie;
};


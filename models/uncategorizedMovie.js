//
//	Creates a mongoose uncategorized movie model.
//	mongoose:				The mongoose instance.
//
exports.create = function(mongoose) {
	if (!mongoose)
		return;

	mongoose.model("UncategorizedMovie", new mongoose.Schema({
		"id": Number,
		"categorizedMovieID": Number,
		"filename": String,
		"createdDate": Date,
		"encoded": Boolean
	}));
};



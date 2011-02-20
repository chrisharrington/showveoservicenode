//
//	Creates a mongoose genre model.
//	mongoose:				The mongoose instance.
//
exports.create = function(mongoose) {
	if (!mongoose)
		return;

	var genre = new mongoose.Schema({
		name: String
	});

	mongoose.model("Genre", genre);
	return genre;
};

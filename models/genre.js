//
//	Creates a mongoose genre model.
//	mongoose:				The mongoose instance.
//
exports.create = function(mongoose) {
	if (!mongoose)
		return;

	mongoose.model("Genre", {
		properties: [
			"name"
		]
	});
};

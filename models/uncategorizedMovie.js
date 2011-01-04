//
//	Creates a mongoose uncategorized movie model.
//	mongoose:				The mongoose instance.
//
exports.create = function(mongoose) {
	if (!mongoose)
		return;

	mongoose.model("UncategorizedMovie", {
		properties: [
			"id",
			"filename",
			"createdDate",
			"encoded"
		],

		cast: {
			createdDate: Date
		}
	});
};


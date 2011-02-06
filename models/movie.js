//
//	Creates a mongoose movie model.
//	mongoose:				The mongoose instance.
//
exports.create = function(mongoose) {
	if (!mongoose)
		return;

	mongoose.model("Movie", {
		properties: [
			"id",
			"name",
			"year",
			"synopsis",
			"genres",
			"uploadDate",
			"lastWatched",
			"lastWatchedDate",
			"poster",
			"director",
			"actors",
			"isFavorite",
			"url",
			"encoded"
		],

		cast: {
			year: Number,
			uploadDate: Date,
			lastWatchedDate: Date
		}
	});
};


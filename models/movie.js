//
//	Creates a mongoose movie model.
//	mongoose:				The mongoose instance.
//
exports.create = function(mongoose) {
	if (!mongoose)
		return;

	mongoose.model("Movie", {
		properties: [
			"name",
			"year",
			"synopsis",
			"genres",
			"owner",
			"uploadDate",
			"lastWatched",
			"lastWatchedDate",
			"poster",
			"director",
			"actors",
			"isFavorite",
			"url"
		]
	});
};


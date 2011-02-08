//
//	A class used to merge user and movie information.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Merges a user and a movie object.
	//	info:			The user-movie info object.
	//	Returns:		The merged movie object.
	//
	exports.merge = function(info) {
		return merge(info);
	};

	//
	//	Merges a list of information objects.
	//	infos:		The collection of information objects.
	//	Returns:		The merged movie objects.
	//
	exports.mergeList = function(infos) {
		var movies = new Array();
		infos.forEach(function(info) {
			movies.push(merge(info));	
		});
		return movies;
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Performs the merge.
	//	info:			The info object.
	//	Returns:		The merged movie object.
	//
	var merge = function(info) {
		var movie = info.movie;
		movie.isFavorite = info.isFavorite;
		return movie;
	};

})();

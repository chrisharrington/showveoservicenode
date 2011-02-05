//
//	A remote movie service used to retrieve detailed movie information.  Talks to themoviedb.org.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The included http library.
	var _http;

	//	The remote service location.
	var _url;

	//	The remote api key.
	var _key;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the movie service.
	//	http:			The included http library.
	//	url:			The root service location.
	//	key:			The remote api key.
	//
	exports.initialize = function(http, url, key) {
		_http = http;
		_url = url;
		_key = key;
	};

	//
	//	Searches the remote repository for a movie.
	//	query:		The search query.
	//	success:		The success callback.
	//	error:		The error callback.
	//
	exports.search = function(query, success, error) {
		if (!query)
			throw "movieService.search:  Invalid search query.";

		query = query.replace(/ /g, "+");

		var options = {
		  host: "api.themoviedb.org",
		  port: 80,
		  path: "/2.1/Movie.search/en/json/" + _key + "/" + query
		};

		_http.get(options, function(res) {
			var data = "";
			res.on("data", function(buffer) {
				data += buffer.toString();
			});
			res.on("end", function() {
				data = JSON.parse(data);

				var movies = new Array();
				for (var i = 0; i < data.length; i++) {
					movies.push({
						id: data[i].id,
						name: data[i].name,
						synopsis: data[i].overview
					});
				}

				success(movies);
			});
		}).on("error", function(e) {
		  	error(e);
		});
	};

})();

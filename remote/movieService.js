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

		_http.get(options, function(response) {
			var data = "";
			response.on("data", function(buffer) {
				data += buffer.toString();
			});
			response.on("end", function() {
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

	//
	//	Retrieves detailed movie information.
	//	id:			The movie ID.
	//	handlers:		The function handlers.
	//
	exports.getByID = function(id, handlers) {
		if (!id)
			throw "movieSearch.getByID:  Invalid movie ID.";

		var options = {
		  host: "api.themoviedb.org",
		  port: 80,
		  path: "/2.1/Movie.getInfo/en/json/" + _key + "/" + id
		};

		_http.get(options, function(response) {
			var data = "";
			response.on("data", function(buffer) {
				data += buffer.toString();
			});
			response.on("end", function() {
				handlers.success(JSON.parse(data)[0]);
			});
		});
	};

})();

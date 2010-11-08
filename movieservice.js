//
//	The movie service used to communicate with TheMovieDB.org and retrieve movie information.
//
var MovieService = function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The api key for TheMovieDB.org's api.
	var _key;

	//	The host to connect to for retrieving movie data.
	var _host;

	//	The included http library.
	var _http;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the movie service.
	//	key:				The api key.
	//	url:				The base url.
	//
	exports.initialize = function(key) {
		_key = key;
		_host = "api.themoviedb.org";
		_http = require("http");
	}

	//
	//	Searches for movie information.
	//	name:				The name of the movie to search for.
	//	callback:			The callback function.
	//
	exports.search = function(name, callback) {
		if (!_key)
			throw "The movie service has not been initialized.";

		var url = "/2.1/Movie.search/en/json/" + _key + "/" + name;

		var data = "";
		var request = _http.createClient(80, _host).request("GET", url, { host: _host });
		request.end();
		request.on("response", function(response) {
			response.setEncoding("utf8");
			response.on("data", function(chunk) {
				data += chunk;
			});
			response.on("end", function() {
				var movies = new Array();
				data = eval(data);
				for (var i = 0; i < data.length; i++)
					movies.push(wrap(data[i]));
				callback(JSON.stringify(movies));	
			});
		});
	}

	//
	//	Retrieves detailed information about a movie.
	//	id:					The ID of the movie.
	//	callback:			The callback function.
	//
	exports.info = function(id, callback) {
		if (!_key)
			throw "The movie service has not been initialized.";

		var url = "/2.1/Movie.getInfo/en/json/" + _key + "/" + id;

		var data = "";
		var request = _http.createClient(80, _host).request("GET", url, { host: _host });
		request.end();
		request.on("response", function(response) {
			response.setEncoding("utf8");
			response.on("data", function(chunk) {
				data += chunk;
			});
			response.on("end", function() {
				data = eval(data)[0];
				callback(JSON.stringify(wrap(data)));
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Derives a poster url from retrieved movie information.
	//	movie:				The detailed movie information.
	//	Returns:			The most appropriate poster's url.
	//
	var derivePosterUrl = function(movie) {
		if (!movie.posters)
			return "";

		for (var i = 0; i < movie.posters.length; i++) {
			console.log("poster url - " + movie.posters[i].image.url);
			return movie.posters[i].image.url;
		}

		return "";
	}

	//
	//	Derives an actors collection from detailed movie information.
	//	movie:				The detailed movie information.
	//	count:				The number of actors to return.
	//	Returns:			A collection of actors.
	//
	var deriveActors = function(movie, count) {
		var actors = new Array();

		if (!movie.cast)
			return actors;

		for (var i = 0; count > 0 && i < movie.cast.length; i++) {
			if (movie.cast[i].job == "Actor") {
				actors.push(movie.cast[i]);
				count--;
			}
		}

		return actors;
	}

	//
	//	Derives a director name from detailed movie information.
	//	movie:				The detailed movie information.
	//	Returns:			The director name.
	//
	var deriveDirector = function(movie) {
		if (!movie.cast)
			return "";

		for (var i = 0; i < movie.cast.length; i++) {
			if (movie.cast[i].job == "Director")
				return movie.cast[i].name;
		}
		return "";
	}

	//
	//	Wraps a movie returned from TheMovieDB.org.
	//	movie:				The movie to wrap.
	//	Returns:			The wrapped movie.
	//
	var wrap = function(movie) {
		if (!movie)
			return {};

		return {
			ID: movie.id,
			Name: movie.name,
			Overview: movie.overview,
			PosterUrl: derivePosterUrl(movie),
			Runtime: movie.runtime,
			Year: movie.released ? movie.released.substr(0, 4) : "",
			Actors: deriveActors(movie),
			Director: deriveDirector(movie)
		};
	}

}();
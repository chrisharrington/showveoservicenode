//
//	A remote movie service used to retrieve detailed movie information.  Talks to themoviedb.org.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The remote service location.
	var _url;

	//	The remote api key.
	var _key;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the movie service.
	//	url:			The root service location.
	//	key:			The remote api key.
	//
	exports.initialize = function(url, key) {
		_url = url;
		_key = key;
	};

	

})();

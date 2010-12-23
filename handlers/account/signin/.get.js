//
//	Handles a request for a sign in operation.
//
var _get = function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	A container for user information.
	var _userRepository;

	//	A url parser.
	var _urlParser;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Initializes the handler.
	//	userRepository:		A container for user information.
	//	urlParser:				A url parser.
	//
	exports.initialize = function(parameters) {
		_userRepository = parameters.userRepository;
		_urlParser = parameters.urlParser;
	};

	//
	//	Handles an incoming request.
	//	request:				The request object.
	//	response:				The response object.
	//
	exports.handle = function(request, response) {
		var parts = _urlParser.parse(request.url).pathname.split("/");
		var identity = parts[parts.length-1].replace(/.data/g, "");
		_userRepository.getByIdentity(identity, {
			success: function(user) {
				response.writeHead(200, { "Content-Type": "application/json" });
				response.end(JSON.stringify(user));
			},
			error: function() {
				response.writeHead(500, { "Content-Type": "text/plain" });
				response.end("An error has occurred while retrieving the logged in user.");
			}
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

}();
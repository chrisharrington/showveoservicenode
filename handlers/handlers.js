//
//	Initializes all of the appropriate handlers.
//
var handlers = function(parameters) {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Creates all of the required request handlers.
	//	parameters:			The parameters object.  Holds all required parameters for handler creation.
	//
	exports.create = function(parameters) {
		createScriptHandlers(parameters);
		createAccountHandlers(parameters);
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Creates all of the required script handlers.
	//	parameters:			The parameters object.  Holds all required parameters for handler creation.
	//
	var createScriptHandlers = function (parameters) {
		require("./script/joined.get").initialize({
			fileJoiner: require("../filejoiner"),
			root: parameters.root
		});
	};

	//
	//	Creates all of the required account handlers.
	//	parameters:			The parameters object.  Holds all required parameters for handler creation.
	//
	var createAccountHandlers = function(parameters) {
		require("./account/signin.get").initialize({
			userRepository: require("../repositories/userRepository"),
			urlParser: require("url")
		});
	};
}();

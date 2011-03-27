//
//	A class used to analyze incoming requests to determine if the request originated from a mobile or desktop browser.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Data Members */

	//	The mobile user-agent regular expression.
	var _isMobile = /(iphone|ipod|blackberry|android|palm|windows\s+ce)/i;

	//	The desktop user-agent regular expression.
	var _isDesktop = /(windows|linux|os\s+[x9]|solaris|bsd)/i;

	//	The bot user-agent regular expression.
	var _isBot = /(spider|crawl|slurp|bot)/i;

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Analyzes a user-agent to determine if it originated from a mobile browser.
	//	useragent:		The user-agent string.
	//	Returns:		The mobile browser flag.
	//
	exports.isMobile = function(useragent) {
		return !isDesktop(useragent);
	};

	//
	//	Analyzes a user-agent to determine if it originated from a desktop browser.
	//	useragent:		The user-agent string.
	//	Returns:		The desktop browser flag.
	//
	exports.isDesktop = function(useragent) {
		return isDesktop(useragent);
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Returns a flag indicating whether or not a user-agent string implies that the request originated from a desktop
	//	browser:
	//	useragent:		The user-agent string.
	//	Returns:		The desktop browser flag.
	//
	var isDesktop = function(useragent) {
		return !_isMobile.test(useragent) && (_isDesktop.test(useragent) || _isBot.test(useragent)); 
	};

})();

//
//	Provides extension utility methods for the string object.
//
exports.initialize = function() {

	//
	//	Returns a flag indicating whether or not the string ends with a particular value.
	//	value:				The value to compare the end of the string with.
	//	Returns:			The flag.
	//
	String.prototype.endsWith = function(value) {
		if (!value || !value.length || this.indexOf(value) == -1)
			return false;

		return this.substring(this.length-value.length) == value;
	};

	//
	//	Returns a flag indicating whether or not the string begins with a particular value.
	//	value:				The value to compare the beginning of the string with.
	//	Returns:			The flag.
	//
	String.prototype.beginsWith = function(value) {
		if (!value || !value.length || this.indexOf(value) == -1)
			return false;

		return this.substring(0, value.length) == value;
	};
	
};

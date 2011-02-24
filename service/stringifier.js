//
//	A class used to wrap the native stringify method with custom writers.
//
(function() {

	//------------------------------------------------------------------------------------------------------------------
	/* Public Methods */

	//
	//	Stringifies the given object into a json representation.
	//	object:					The object to stringify.
	//	Returns;				The stringified object.
	//
	exports.stringify = function(object) {
		stringify(object);
		return JSON.stringify(object);
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Replaces the _id objects with regular old id strings.
	//	object:					The object to modify.
	//
	var stringify = function(object) {
		if (!object)
			return;

		if (!object.charAt && object.length) {
			for (var i = 0; i < object.length; i++)
				stringify(object[i]);
		}
		else {
			if (object._id) {
				object.id = object._id.toHexString();
				object._id = undefined;
			}
		}
	};

})();

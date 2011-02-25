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
		return JSON.stringify(strip(object));
	};

	//------------------------------------------------------------------------------------------------------------------
	/* Private Methods */

	//
	//	Replaces the _id objects with regular old id strings.
	//	object:					The object to modify.
	//
	var strip = function(object) {
		if (!object)
			return object;

		if (!object.charAt && object.length) {
			for (var i = 0; i < object.length; i++)
				object[i] = strip(object[i]);
			return object;
		}
		else {
			if (object._id) {
				object.id = object._id.toHexString();
				object._id = undefined;

				for (var name in object)
					object[name] = strip(object[name]);
			}
			return object;
		}
	};

})();

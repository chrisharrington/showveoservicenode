//
//	Creates a mongoose user model.
//	mongoose:				The mongoose instance.
//
exports.create = function(mongoose) {
	if (!mongoose)
		return;

	mongoose.model("User", {
		properties: [
			"firstName",
			"lastName",
			"emailAddress",
			"identity",
			"password"
		]
	});
};

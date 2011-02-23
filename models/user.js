//
//	Creates a mongoose user model.
//	mongoose:				The mongoose instance.
//
exports.create = function(mongoose) {
	if (!mongoose)
		return;

	var user = new mongoose.Schema({
		firstName: String,
		lastName: String,
		emailAddress: String,
		identity: String,
		password: String
	});
	mongoose.model("User", user);
	return mongoose.model("User");
};

var mongoose = require("mongoose").Mongoose;
require("./models/uncategorizedMovie").create(mongoose);

var db = mongoose.connect("mongodb://localhost/test");
db.model("UncategorizedMovie").find().all(function(movies) {
	for (var i = 0; i < movies.length; i++)
		movies[i].remove();
	
});
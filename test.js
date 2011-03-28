var fileretriever = require("./file/fileretriever");
fileretriever.getPortionOfFile("/home/chris/Code/showveo/test.ogv", {}, function(file) {
	console.log("success! " + file.length);
}, function(err) {
	console.log("error - " + err);
});
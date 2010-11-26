var filejoiner = require("./filejoiner");

filejoiner.join({
	root: "/home/chrisharrington/Code/showveo",
	path: "/",
	extension: "js",
	callback: function(data) {
		while (data.length > 0) {
			data = data.substring(0, 1000);
			
		}
	}
});
require("./extensions/string").initialize();

var watcher = require("./watcher/watcher");
watcher.initialize();
watcher.watch("/home/chris/Test", function(name) {
	console.log("File added:  " + name);
}, function(name) {
	console.log("File removed: " + name);
});